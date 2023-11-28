from datetime import datetime
from datagen import generate_weather_data
from result import Printer
from analysis import *

cities = ["CityA", "CityB", "CityC"]
start_date = datetime(2023, 1, 1)
end_date = datetime(2023, 12, 31)
weather_data = generate_weather_data(start_date, end_date, cities)

daily_averages = calculate_daily_average(weather_data)
monthly_averages = calculate_monthly_average(weather_data)
extreme_weather = identify_extreme_events(weather_data)

temp_trends = temperature_trend_analysis(weather_data)
weather_correlations = correlation_analysis(weather_data)
extreme_event_freq = extreme_weather_frequency(weather_data)
yearly_stats = yearly_summary(weather_data)
max_min_temp_days = find_max_min_temp_days(weather_data)

printer = Printer()
printer.print_extreme_events(extreme_weather)
printer.print_temperature_trends(temp_trends)
printer.print_correlation_analysis(weather_correlations)
printer.print_extreme_weather_frequency(extreme_event_freq)
printer.print_yearly_summary(yearly_stats)
printer.print_max_min_temp_days(max_min_temp_days)