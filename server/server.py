from langchain.document_loaders.generic import GenericLoader
from langchain.document_loaders.parsers import LanguageParser
from langchain.text_splitter import Language
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores.chroma import Chroma
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
import json
from langchain.chat_models import ChatOpenAI

# importing ai part
import sys
import os

# Add the parent directory to the sys.path
current_dir = os.path.dirname(os.path.realpath(__file__))
parent_dir = os.path.abspath(os.path.join(current_dir, '..'))
sys.path.append(parent_dir)

from ai.code2tree import SymoblSplitter
from ai.custom_langchain import CustomRetrievalQA

sys.path.remove(parent_dir)

repo_path = "../example2/"
task = "add normalization to Price variable"

loader = GenericLoader.from_filesystem(
    repo_path,
    glob="**/*",
    suffixes=[".py"],
    parser=LanguageParser(language=Language.PYTHON, parser_threshold=500),
)

documents = loader.load()

symbol_splitter = SymoblSplitter.from_language(
    language=Language.PYTHON, chunk_size=256, chunk_overlap=64
)
nodes, texts = symbol_splitter.split_documents(documents)

with open('nodes.json', 'w') as file:
    json.dump(nodes, file)

embedder = OpenAIEmbeddings(disallowed_special=())
db = Chroma.from_documents(texts, embedder)

retriever = db.as_retriever(
    search_type="mmr",
    search_kwargs={'k': 20}
)

callback_manager = CallbackManager([StreamingStdOutCallbackHandler()])
llm = ChatOpenAI(model_name='gpt-4')

retrievalQA = CustomRetrievalQA.from_llm(llm=llm, retriever=retriever, return_source_documents=True)

#### server part ####
from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

from pydantic import BaseModel
from langchain.docstore.document import Document
from urllib.parse import unquote


from typing import List, Union
app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:80",
    "http://localhost:3000",
    "http://14.52.35.74",
    "http://14.52.35.74:80",
    "https://beautiful-bunny-6d0cd3.netlify.app",
    "https://beautiful-bunny-6d0cd3.netlify.app/:1",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(HTTPSRedirectMiddleware)

class RepoTree(BaseModel):
    folders: dict
    files: dict

class DocumentMetadata(BaseModel):
    source: str
    language: str

class ResultDocument(BaseModel):
    page_content: str
    metadata: DocumentMetadata
    type: str

def transform_repo_tree(repo_tree: RepoTree) -> List[ResultDocument]:
    documents = []

    def process_folder(folder, path=""):
        nonlocal documents
        for name, content in folder.get("folders", {}).items():
            process_folder(content, f"{path}/{name}")
        for name, content in folder.get("files", {}).items():
            if name.endswith(".py"):
                document = {
                    "page_content": content,
                    "metadata": {"source": f"../example1{path}/{name}", "language": "python"},
                    "type": "Document",
                }
                documents.append(document)

    process_folder(repo_tree.dict())
    return documents

def convert_to_langchain_documents(result_documents: List[ResultDocument]) -> List[Document]:
    langchain_documents = []

    for result_document in result_documents:
        langchain_document = Document(
            page_content=result_document.get("page_content"),
            metadata={
                "source": result_document.get("metadata").get("source"),
                "language": result_document.get("metadata").get("language"),
            },
            type=result_document.get("type"),
        )
        langchain_documents.append(langchain_document)

    return langchain_documents

# for testing
@app.get("/ping/{name}")
async def test_ping(name: str):
    respond = {"name": name}
    return respond

@app.get("/docs")
async def getDocs():
    return documents

@app.get("/nodes")
async def getNodes():
    return nodes

@app.get("/texts")
async def getTexts():
    return texts

# for running
@app.post("/treeUpdate/")
async def update_tree(repo_tree: RepoTree):
    global nodes, texts
    docs = transform_repo_tree(repo_tree)
    lc_docs = convert_to_langchain_documents(docs)
    nodes, texts = symbol_splitter.split_documents(lc_docs)

    with open('nodes.json', 'w') as file:
        json.dump(nodes, file)
    return nodes

@app.post("/askai/{task}")
async def ask_ai(task):
    global texts, embedder
    db = Chroma.from_documents(texts, embedder)

    retriever = db.as_retriever(
        search_type="mmr",
        search_kwargs={'k': 20}
    )

    callback_manager = CallbackManager([StreamingStdOutCallbackHandler()])
    llm = ChatOpenAI(model_name='gpt-4')

    retrievalQA = CustomRetrievalQA.from_llm(llm=llm, retriever=retriever, return_source_documents=True)

    result = retrievalQA(task)
    return result['result'].snippets

if __name__ == "__main__":
    import uvicorn
    from pathlib import Path
    kfile=Path("./mycert+4-key.pem")
    cfile=Path("./mycert+4.pem")
    assert kfile.exists()
    uvicorn.run("server:app", reload=True, host="0.0.0.0", port=443, ssl_keyfile=kfile, ssl_certfile=cfile)
