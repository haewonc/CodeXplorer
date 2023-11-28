import numpy as np
from datetime import timedelta

def generate_weather_data(start_date, end_date, cities):
    """
    Generate simulated weather data for given cities between start_date and end_date.
    Data includes temperature (in °C), humidity (%), and wind speed (km/h).
    """
    delta = end_date - start_date
    data = {}
    for city in cities:
        daily_data = []
        for day in range(delta.days + 1):
            date = start_date + timedelta(days=day)
            temperature = np.random.uniform(-5, 35)  # Simulating temperature
            humidity = np.random.uniform(20, 100)    # Simulating humidity
            wind_speed = np.random.uniform(0, 100)   # Simulating wind speed
            daily_data.append((date, temperature, humidity, wind_speed))
        data[city] = daily_data
    return data
