import matplotlib.pyplot as plt
import seaborn as sns
class ResultVisualizer():
    def vis_data(self, data):
        sns.pairplot(data, x_vars=['Area', 'Bedrooms', 'Bathrooms'], y_vars='Price', height=4, aspect=1, kind='scatter')
        plt.savefig('data.png')
        plt.clf()
        plt.close()
    
    def vis_preds(self, y_true, y_pred):
        plt.scatter(y_true, y_pred)
        plt.xlabel('Actual Prices')
        plt.ylabel('Predicted Prices')
        plt.title('Predicted vs Actual Prices')
        plt.plot([y_true.min(), y_true.max()], [y_true.min(), y_true.max()], 'k--', lw=2)
        plt.savefig('preds.png')
        plt.clf()
        plt.close()

    def vis_feature_importance(self, best_model):
        if hasattr(best_model, 'feature_importances_'):
            sns.barplot(x=best_model.feature_importances_, y=['Area', 'Bedrooms', 'Bathrooms'])
            plt.title('Feature Importance')
            plt.savefig('feat.png')
            plt.clf()
            plt.close()