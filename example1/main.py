from src.comparator import ModelComparator
from src.visualizer import ResultVisualizer
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
import pandas as pd

# Load dataset
data = pd.read_csv('data/house_prices.csv')
X = data[['Area', 'Bedrooms', 'Bathrooms']]
y = data['Price']

# Split the dataset
X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.4, random_state=42)
X_valid, X_test, y_valid, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)

# Initialize models
models = [LinearRegression(), DecisionTreeRegressor()]

# Create comparator and find best model
comparator = ModelComparator(models)
comparator.fit_and_evaluate(X_train, y_train, X_valid, y_valid)
best_model = comparator.get_best_model()

# Evaluate on test data
test_predictions = best_model.predict(X_test)
test_mse = mean_squared_error(y_test, test_predictions)
print(f"Test MSE of Best Model: {test_mse}")

visualizer = ResultVisualizer()
visualizer.vis_data(data)
visualizer.vis_preds(y_test, test_predictions)
visualizer.vis_feature_importance(best_model)
