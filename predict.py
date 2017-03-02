# encoding=utf8
"""
Make naïve predictions from provided temperature data.
"""

import pandas as pd
from fbprophet import Prophet

DATA = pd.read_csv('src/daily.csv')
# TMAX = pd.DataFrame({'ds': pd.to_datetime(df['DATE'], format='%Y%m%d'), 'y': np.log(df['TMAX'])})

# Convert date strings to Date objects
DATA['DATE'] = pd.to_datetime(DATA['DATE'], format='%Y%m%d')

def make_prediction_data(data, keep, drop):
    """
    Get predictions from the historical dataset, one column at a time.
    """
    # Tidy data for Prophet
    data = data.drop(drop, 1)
    data.columns = ['ds', 'y']

    # Create and fit model
    model = Prophet()
    model.fit(data)

    # Generate output DataFrame
    future = model.make_future_dataframe(periods=365)
    forecast = model.predict(future)

    # Merge predictions back onto base data
    data = pd.merge(data, forecast[['ds', 'yhat']], on='ds', how='outer')
    data = data.round(1)
    data.columns = ['DATE', keep, keep+'_PRED']

    return data

# Get predictions
TMAX = make_prediction_data(DATA, keep='TMAX', drop='TMIN')
TMIN = make_prediction_data(DATA, keep='TMIN', drop='TMAX')

# Recombine datasets
DATA = pd.merge(TMAX, TMIN, on='DATE')

# Rewrite dates to naïve string format
DATA['DATE'] = DATA['DATE'].dt.strftime('%Y%m%d')

# Write result to file
DATA.to_csv('src/daily_pred.csv', index=False)
