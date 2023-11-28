class Printer:
    def __init__(self):
        pass

    def print_daily_average(self, daily_averages):
        print("Daily Averages:")
        for city, averages in daily_averages.items():
            print(f"\n{city}:")
            for avg in averages:
                print(f" - {avg:.2f}")

    def print_monthly_average(self, monthly_averages):
        print("\nMonthly Averages:")
        for city, months in monthly_averages.items():
            print(f"\n{city}:")
            for month, avg_values in months.items():
                print(f" - Month {month}: Temp: {avg_values[0]:.2f}, Hum: {avg_values[1]:.2f}, Wind: {avg_values[2]:.2f}")

    def print_extreme_events(self, extreme_events):
        print("\nExtreme Weather Events:")
        for city, events in extreme_events.items():
            print(f"\n{city}:")
            for event in events:
                print(f" - Date: {event[0]}, Temp: {event[1]:.2f}, Wind: {event[2]:.2f}")

    def print_temperature_trends(self, trends):
        print("\nTemperature Trends:")
        for city, trend in trends.items():
            slope, intercept = trend
            trend_line = "increasing" if slope > 0 else "decreasing"
            print(f"{city}: Trend is {trend_line}, Slope: {slope:.2f}")

    def print_correlation_analysis(self, correlations):
        print("\nCorrelations between Weather Parameters:")
        for city, corr_values in correlations.items():
            print(f"\n{city}:")
            for pair, corr in corr_values.items():
                print(f" - {pair}: {corr:.2f}")

    def print_extreme_weather_frequency(self, frequencies):
        print("\nFrequency of Extreme Weather Events:")
        for city, frequency in frequencies.items():
            print(f"{city}: {frequency} events")

    def print_yearly_summary(self, yearly_stats):
        print("\nYearly Summary Statistics:")
        for city, stats in yearly_stats.items():
            print(f"\n{city}:")
            for stat_name, value in stats.items():
                print(f" - {stat_name}: {value:.2f}")
    
    def print_max_min_temp_days(self, max_min_temp_days):
        print("\nDays with Maximum and Minimum Temperatures:")
        for city, temp_info in max_min_temp_days.items():
            print(f"\n{city}:")
            print(f" - Maximum Temperature: {temp_info['Max Temp']:.2f} °C on {temp_info['Max Temp Day']}")
            print(f" - Minimum Temperature: {temp_info['Min Temp']:.2f} °C on {temp_info['Min Temp Day']}")