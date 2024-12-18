# Utilisation de l'image de base PHP avec Apache
FROM php:8.1-apache

# Installation des dépendances nécessaires pour PHP et MySQL
RUN docker-php-ext-install mysqli

# Copier le fichier PHP de l'hôte vers le conteneur dans le répertoire adéquat
COPY ./api.php /var/www/html/api.php

# S'assurer qu'Apache utilise le bon répertoire de travail
WORKDIR /var/www/html

# Exposer le port 80 pour l'accès à l'application web
EXPOSE 80

# Démarrer Apache en mode foreground pour que le conteneur reste actif
CMD ["apache2-foreground"]