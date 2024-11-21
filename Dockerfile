# Базовый образ Node.js
FROM node:22.9.0

# Создаем рабочую директорию
WORKDIR /usr/src/app

# Копируем файлы package.json и package-lock.json для установки зависимостей
COPY package*.json ./ 

# Устанавливаем зависимости
RUN npm install

# Копируем все остальные файлы приложения
COPY . .

# Генерируем Prisma клиент
RUN npx prisma generate

RUN chmod -R 777 /usr/src/app/logs

# Указываем порт, который используется приложением
EXPOSE 4000

# Указываем команду для запуска приложения
CMD ["npm", "start"]
