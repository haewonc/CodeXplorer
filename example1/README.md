# example1 

## Task 1. Add normalization to Price variable
### Example answer
In `main.py` after `y = data['Price']` add
```
min_y, max_y = y.min(), (y.max()-y.min())
y -= y.min()
y /= y.max()
```

## Task 2. Store performance of all models
### Example answer
In `comparator.py` in method `__init__` add
```
self.performance = []
```
In `comparator.py` in method `fit_and_evaluate` add
```
self.performance.append(mse)
```