FROM python:3.11

WORKDIR /app

# Installation des dépendances système
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copie des requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copie du code source
COPY . .

# Création des répertoires média
RUN mkdir -p media/products

# Port d'exposition
EXPOSE 8000

# Variables d'environnement
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=urbantendance.settings

# Commande par défaut
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]