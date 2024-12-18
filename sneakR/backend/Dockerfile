FROM php:7.4-apache

# Installer les extensions nécessaires
RUN docker-php-ext-install mysqli

# Activer mod_rewrite pour Apache
RUN a2enmod rewrite

# Copier le code dans le conteneur
COPY ./src /var/www/html/

# Exposer le port 80 pour l'accès HTTP
EXPOSE 80