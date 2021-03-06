# DeviceInfo-API

1. [Описание](#Описание)
2. [Системные требования](#Системные-требования)
3. [Параллельные проекты](#Параллельные-проекты)
4. [Схема БД](#Схема-БД)
    - [Коллекция устройств](#Коллекция-устройств)
        - [Формат документа](#Формат-документа)
        - [Пример документа](#Пример-документа)
5. [Файл конфигурации](#Файл-конфигурации)
6. [Установка](#Установка)
7. [Использование](#Использование)
    - [Управление](#Управление)

## <a name="Описание">Описание</a>

Предоставляет интерфейс для получения данных с устройств по SNMPv1 и SNMPv2c

## <a name="Системные-требования">Системные требования</a>

- nodejs
- mongodb

## <a name="Параллельные-проекты">Параллельные проекты</a>

Возможно использовать совместно с:

- [DeviceInfo-Service](https://github.com/moonlynx/DeviceInfo-Service)

## <a name="Схема-БД">Схема БД</a>

### <a name="Коллекция-устройств">Коллекция устройств</a>

Хранит документы с информацией об устройствах

Имя коллекции с документами устройств задается в '/app/config.js' в поле 'cDevices'

#### <a name="Формат-документа">Формат документа</a>

```no-highlight
    {
        id: <Идентификатор устройства>,
        name: <имя устройства>
        ip: <ip адрес устройства>
        oids: {
            <имя объекта>: <номер объекта>, // имя объекта имеет произвольный формат, соответствующий
            <имя объекта>: <номер объекта>  //  требованию к ключам mongodb
        }
        comunity: <readonly comunity устройства>
    }
```

**[требование к ключам](https://docs.mongodb.com/v3.6/core/document/#document-structure)** mongodb

#### <a name="Пример-документа">Пример документа</a>

```no-highlight
    {
        id: <Идентификатор устройства>,
        name: "HP LaseJet 9050n"
        ip: <ip адрес устройства>
        oids: {
            totalPrintPages: "1.3.6.1.2.1.43.10.2.1.4.1.1"
        }
        comunity: "public"
    }
```

## <a name="Файл-конфигурации">Файл конфигурации</a>

```no-highlight
    // В следующих полях указывается адрес и порт, на которых сервер будет прослушивать соединения
    httpHost: "127.0.0.1",
    httpPort: 3001,

    // В следующих полях указывается адрес и порт mongodb сервера
    dbServer: "127.0.0.1",
    dbPort: "27017",

    dbName: "dbDeviceInfo", // Имя базы данных
    username: "readonly", // Имя пользователя для подключения к БД
    password: "readonly", // Пароль пользователя для подключения к БД

    cDevices: "Devices", // Имя коллекции устройств

    authDb: "admin" //Имя БД для аутентификации пользователя
```

## <a name="Установка">Установка</a>

1. скачать [архив](https://github.com/moonlynx/DeviceInfo-API/blob/master/distr/DeviceInfo-API.zip)
2. распаковать
3. в терминале перейти в папку с проектом: `cd <path/to/DeviceInfo-API>`
4. установить pm2 pm2-logs и pm2-logrotate глобально: `npm -g install pm2 pm2-logs pm2-logrotate`
5. установить проект: `npm install`

## <a name="Использование">Использование</a>

#### GET-запрос **query** с параметром **ip**

```no-highlight
    http://<адрес сервера>:<порт сервера>/query?ip=<ip-адрес устройства>
```

- возвращает массив значений OID устройства с указанным ip-адресом в формате:

```no-highlight
    {
        name: <имя оъекта>,
        oid: <номер объекта>,
        value: <значение>
    }
```

- возвращает пустой массив, если устройство с указанным IP адресом отсутствует в базе данных

#### GET-запрос **devices**

```no-highlight
    http://<адрес сервера>:<порт сервера>/devices
```

- возвращает массив всех документов в коллекции устройств без поля **id**

### <a name="Управление">Управление</a>

- запуск проекта: 'npm start'
- перезапуск проекта: 'npm restart'
- остановка проекта: 'npm stop'