FROM python:3.7.8-slim

EXPOSE 8000
COPY . /code
WORKDIR /code
RUN pip install pipenv && pipenv install --dev
ENTRYPOINT ["pipenv", "run"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
