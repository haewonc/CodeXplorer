from sklearn.metrics import mean_squared_error
import numpy as np

class ModelComparator:
    def __init__(self, models):
        self.models = models
        self.best_model = None

    def fit_and_evaluate(self, X_train, y_train, X_valid, y_valid):
        best_mse = np.inf
        for model in self.models:
            model.fit(X_train, y_train)
            predictions = model.predict(X_valid)
            mse = mean_squared_error(y_valid, predictions)
            if mse < best_mse:
                best_mse = mse
                self.best_model = model

    def get_best_model(self):
        return self.best_model
