FROM node:16

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json
COPY package*.json ./


RUN npm install

# Копируем весь проект
COPY . .

# Запускаем приложение
CMD ["npm", "start"]
