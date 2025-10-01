# ToDo List Uygulaması ( Angular + .NET Core )

Bu proje CQRS mimarisi kullanılarak geliştirilmiş bir ToDo projesidir.
Frontend **Angular** ,Backend **Asp .NET Core Web API** ile oluşturulmuştur

## Kullanılan Teknolojiler

**Backend**
  - ASP.NET Core 9.0
  - Entity Framework Core
  - MSSQL Server
  - Swagger

**Frontend**
  - Angular 19
  - Typescript
  - HTML + SCSS
  - RxJS

## Api Endpointleri

**GET /api/ToDo**  

`https://localhost:7261/api/ToDo`

  - Response :

[
  {
    "id": "4ae59acd-8fc5-4c5a-a650-357c35f40077",
    "title": "Angular",
    "description": "Projenin taslağı hazır",
    "isCompleted": true,
    "createdAt": "2025-09-29T14:01:56.7627006"
  },
  {
    "id": "385ef7db-3a76-4383-bbb5-7be2901daad1",
    "title": "Proje",
    "description": "Projenin backendini bitir",
    "isCompleted": false,
    "createdAt": "2025-09-29T16:24:51.8011358"
  }
]


    
**Post /api/ToDo**

`https://localhost:7261/api/ToDo`

- Response :

{
  "id": "19317550-d35e-4d1e-9838-d30ac15a9df2",
  "title": "Projeyi Github'a Yükle",
  "description": "Proje Teslim",
  "isCompleted": false,
  "createdAt": "2025-10-01T10:41:19.7639152+03:00"
}

**GET /api/ToDo/{id}**

`https://localhost:7261/api/ToDo/276eae14-8473-40e8-9340-8afee6a406c7`

- Response :

{
  "id": "276eae14-8473-40e8-9340-8afee6a406c7",
  "title": "Angular",
  "description": "Projenin frontendini bitir",
  "isCompleted": false,
  "createdAt": "2025-09-29T14:07:13.1611192"
}

**DELETE /api/ToDo/{id}**

`https://localhost:7261/api/ToDo/ecc7f2a2-47a9-4178-8f5d-812f49be6275`

- Response :

{
  "id": "ecc7f2a2-47a9-4178-8f5d-812f49be6275",
  "title": "test",
  "description": "test",
  "isCompleted": true,
  "createdAt": "2025-09-30T14:48:22.2798793"
}

**PUT /api/ToDo/{id}**

`https://localhost:7261/api/ToDo/276eae14-8473-40e8-9340-8afee6a406c7`


- Response :

{
  "id": "276eae14-8473-40e8-9340-8afee6a406c7",
  "title": "Proje teslim",
  "description": "Teslimat listesini kontrol et",
  "isCompleted": true,
  "createdAt": "2025-09-29T14:07:13.1611192"
}

## Projeyi Çalıştırma ve Setup Adımları

**Projeyi Çalıştırmak İçin Gerekli Önkoşullar**

- .NET SDK 9.0 veya uyumlu sürüm
- SQL Server	
- Node.js ve npm	
- Angular CLI	
- Entity Framework Core Tools

**Backend kurulumu**
1. Backend klasörüne gidin.
- cd ../AngularWithASP/AngularWithASP.Server
2. Gerekli .NET paketlerini yükleyin:
- dotnet restore
3. Veribağlantısını ayarlamak için appsettings.json dosyasına kendi SQL server bilgilerinizi girin.
- "ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER;Database=ToDoDb;Trusted_Connection=True;"
}
4. Entity Framework Migrations ile veritabanını oluşturun.
- dotnet ef database update
5. API'yı çalıştırın.
- dotnet run
6. Swagger ile endpoint'leri test edebilirsiniz. Visual Studio çalıştırma çıktısında belirtilen URL üzerinden Swagger’a erişin.

- https://localhost:7261/swagger/index.html

**Frontend kurulumu**
1. Frontend klasörüne gidin.
- cd ../AngularWithASP/angularwithasp.client
2. Angular paketlerini yükle.
- npm install
3. Angular uygulamasını başlat
- ng serve --open



