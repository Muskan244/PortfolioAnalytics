set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate
python manage.py import_portfolio_data dashboard/fixtures/SamplePortfolioDataset.xlsx