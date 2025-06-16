# ใช้ Node.js LTS image
FROM node:18

# สร้าง working directory
WORKDIR /app

# คัดลอก dependencies และติดตั้ง
COPY package*.json ./
RUN npm install

# คัดลอกไฟล์โปรเจกต์ทั้งหมดเข้า image
COPY . .

# build โปรเจกต์
RUN npm run build

# เปิดพอร์ต 3000
EXPOSE 3000

# สั่งให้รันใน production mode
CMD ["npm", "start"]
