from langchain.document_loaders.generic import GenericLoader
from langchain.document_loaders.parsers import LanguageParser
from langchain.text_splitter import Language
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores.chroma import Chroma
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
import json
from langchain.chat_models import ChatOpenAI
from code2tree import SymoblSplitter
from custom_langchain import CustomRetrievalQA

repo_path = "example1/"
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

from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from urllib.parse import unquote

app = FastAPI()

@app.get("/{prompt}")
def update_item(prompt):
    result = retrievalQA(unquote(prompt))
    return JSONResponse(content=jsonable_encoder(result))
