import numpy as np

def calculate_daily_average(data):
    """
    Calculate daily average of temperature, humidity, and wind speed for each city.
    """
    averages = {}
    for city, daily_data in data.items():
        daily_avg = []
        for _, temp, hum, wind in daily_data:
            avg = (temp + hum + wind) / 3
            daily_avg.append(avg)
        averages[city] = daily_avg
    return averages

def calculate_monthly_average(data):
    """
    Calculate monthly average of temperature, humidity, and wind speed for each city.
    """
    monthly_avg = {}
    for city, daily_data in data.items():
        monthly_data = {}
        for date, temp, hum, wind in daily_data:
            month = date.month
            if month not in monthly_data:
                monthly_data[month] = []
            monthly_data[month].append((temp, hum, wind))
        
        for month, values in monthly_data.items():
            avg = np.mean(values, axis=0)
            if city not in monthly_avg:
                monthly_avg[city] = {}
            monthly_avg[city][month] = avg
    return monthly_avg

def identify_extreme_events(data, temp_threshold=35, wind_threshold=75):
    """
    Identify days with extreme weather events based on given thresholds.
    """
    extreme_events = {}
    for city, daily_data in data.items():
        extreme_days = []
        for date, temp, hum, wind in daily_data:
            if temp > temp_threshold or wind > wind_threshold:
                extreme_days.append((date, temp, wind))
        extreme_events[city] = extreme_days
    return extreme_events

def temperature_trend_analysis(data):
    """
    Analyze temperature trends for each city.
    """
    trends = {}
    for city, daily_data in data.items():
        temps = [temp for _, temp, _, _ in daily_data]
        trend = np.polyfit(range(len(temps)), temps, 1)  # Linear trend
        trends[city] = trend
    return trends

def correlation_analysis(data):
    """
    Calculate correlation between different weather parameters for each city.
    """
    correlations = {}
    for city, daily_data in data.items():
        temps = [temp for _, temp, _, _ in daily_data]
        hums = [hum for _, _, hum, _ in daily_data]
        winds = [wind for _, _, _, wind in daily_data]

        temp_hum_corr = np.corrcoef(temps, hums)[0, 1]
        temp_wind_corr = np.corrcoef(temps, winds)[0, 1]
        hum_wind_corr = np.corrcoef(hums, winds)[0, 1]

        correlations[city] = {
            "Temp-Humidity": temp_hum_corr,
            "Temp-Wind": temp_wind_corr,
            "Humidity-Wind": hum_wind_corr
        }
    return correlations

def extreme_weather_frequency(data, temp_threshold=35, wind_threshold=75):
    """
    Analyze the frequency of extreme weather events.
    """
    frequency = {}
    for city, daily_data in data.items():
        count = sum(1 for _, temp, _, wind in daily_data if temp > temp_threshold or wind > wind_threshold)
        frequency[city] = count
    return frequency

def yearly_summary(data):
    """
    Generate a summary of yearly weather statistics for each city.
    """
    summary = {}
    for city, daily_data in data.items():
        temps = [temp for _, temp, _, _ in daily_data]
        hums = [hum for _, _, hum, _ in daily_data]
        winds = [wind for _, _, _, wind in daily_data]

        summary[city] = {
            "Average Temp": np.mean(temps),
            "Max Temp": max(temps),
            "Min Temp": min(temps),
            "Average Humidity": np.mean(hums),
            "Average Wind Speed": np.mean(winds)
        }
    return summary

def find_max_min_temp_days(data):
    """
    Find the days with the maximum and minimum temperatures for each city.
    """
    max_min_days = {}
    for city, daily_data in data.items():
        max_temp = -float('inf')
        min_temp = float('inf')
        max_temp_day = None
        min_temp_day = None

        for day in daily_data:
            date, temp, _, _ = day
            if temp > max_temp:
                max_temp = temp
                max_temp_day = date
            if temp < min_temp:
                min_temp = temp
                min_temp_day = date

        max_min_days[city] = {'Max Temp Day': max_temp_day, 'Max Temp': max_temp, 
                              'Min Temp Day': min_temp_day, 'Min Temp': min_temp}
    return max_min_days