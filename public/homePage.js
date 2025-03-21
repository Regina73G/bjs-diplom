"use strict";

//Выход из личного кабинета
const logout = new LogoutButton();
logout.action = () => {
  ApiConnector.logout(response => {
    if(response.success) {
      location.reload();
    }
  });
}

// Получение информации о пользователе
ApiConnector.current(response => {
  if(response.success) {
    ProfileWidget.showProfile(response.data);
  }
});

// Получение текущих курсов валюты
const ratesBoard = new RatesBoard();
function updateExchangeRate() {
  ApiConnector.getStocks((response) => {
    if(response.success) {
      ratesBoard.clearTable();
      // console.log(response.data);
      ratesBoard.fillTable(response.data);
    }
  });
};

updateExchangeRate();
const intervalId = setInterval(updateExchangeRate, 1000);

// Операции с деньгами
  //Пополнение
const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = (data) => {
  ApiConnector.addMoney(data, (response) => {
    if(response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(response.success, "Баланс успешно пополнен.");
    } else {
      moneyManager.setMessage(response.success, response.error);
    }
  });
};
  // Конвертация
moneyManager.conversionMoneyCallback = (data) => {
  ApiConnector.convertMoney(data, (response) => {
    if(response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(response.success, "Валюта успешно сконвертирована.");
    } else {
      moneyManager.setMessage(response.success, "response.error");
    }
  });
};
  // Перевод
moneyManager.sendMoneyCallback = (data) => {
  ApiConnector.transferMoney(data, (response) => {
    if(response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(response.success, "Перевод средств успешно выполнен");
    } else {
      moneyManager.setMessage(response.success, response.error);
    }
  });
};

// Работа с избранным
  // Начальный список избранного
const favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites((response) => {
  if(response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  }
});

  // Добавления пользователя в список избранных
favoritesWidget.addUserCallback = ({id, name}) => {
  ApiConnector.addUserToFavorites({id, name}, (response) => {
    if(response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favoritesWidget.setMessage(response.success, `Пользователь ${name} успешно добавлен в список избранного`);
    } else {
      favoritesWidget.setMessage(response.success, response.error);
    }
  });
};

  // Удаление пользователя из избранного
  favoritesWidget.removeUserCallback = (id) => {
    ApiConnector.removeUserFromFavorites(id, (response) => {
      if(response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
        favoritesWidget.setMessage(response.success, "Пользователь успешно удалён из списка избранного");
      } else {
        favoritesWidget.setMessage(response.success, response.error);
      }
    });
  }