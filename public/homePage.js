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
const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = (data) => {
  ApiConnector.addMoney(data, (response) => {
    if(response.success) {
      ProfileWidget.showProfile(response.data);
      this.setMessage(isSuccess, message);
    } else {
      this.setMessage(isSuccess, message);
    }
  });
};

// далее 3 пункт
