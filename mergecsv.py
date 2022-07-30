'''
This program reads two csv files and merges them based on a common key column.
'''
import pandas as pd

# Read the files into two dataframes.
df1 = pd.read_csv('hdi.csv')
df2 = pd.read_csv('iso.csv')

# Merge the two dataframes, using _ID column as key
df3 = pd.merge(df1, df2, on = 'Country', how='left')

# Write it to a new CSV file
df3.to_csv('CSV3.csv')