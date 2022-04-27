const jsonData = [];
let currentCityData = '';
let currentTownData = '';
let curPage = 0;
let showAmount = 10;

const elemLoadingPage = document.querySelector('#LoadingPage');
// const elemCountySelector = document.querySelector('#CountySelector');
// const elemTownSelector = document.querySelector('#TownSelector');
const elemContent = document.querySelector('#Content');
const elemResTableContent = document.querySelector('#ResTableContent');

const dataUrl = 'https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx';
const limitWordLen = 101;

// const optionTemp = (item) => `<option value="${item}">${item}</option>`;
const listTemp = (item) => `
        <section class="res">
          ${item.Url === '' ? '' : `<a class="res__link" target="_blank" href="${item.Url}">`}
            <figure class="res__fig res__fig--cover">
              <img class="res__img"
                src="${item.PicURL}"
                alt="${item.Name}" 
                width="400" 
                height="267">
            </figure>
            <div class="res__text">
              <h2 class="res__title">${item.Name}</h2>
              <div class="res__info">
                <p class="res__flag">${item.City}</p>
                <p class="res__desc res__desc--vertical">${item.Town}</p>
              </div>
              <p class="res__paragh">${textLimit(item.FoodFeature)}</p>
            </div>
            ${item.Url === '' ? '' : `</a>`}
        </section>`;

const tableTemp = (item, i) => `
        <tr class="resTable__row ${i % 2 === 1 ? '' : ' resTable__row--stripe'}">
                <td class="resTable__td resTable__td--textCenter resTable__td--order">
                  ${curPage * showAmount + i + 1}
                </td>
                <td class="resTable__td">
                  ${item.City}
                </td>
                <td class="resTable__td resTable__td--img">
                  ${item.Town}
                </td>
                <td class="resTable__td resTable__td--fixed">
                ${item.Name}
                </td>
                <td class="resTable__td">
                  ${item.Address}
                </td>
            </tr>`;

(async () => {
  setJsonData(await fetchData());
  // elemCountySelector.innerHTML += strMaker(optionTemp, setCateData(jsonData, 'City'));
  // elemContent.innerHTML += strMaker(listTemp, setDataArray());
  elemResTableContent.innerHTML += strMaker(tableTemp, setDataArray());
  setListener();
  elemLoadingPage.remove();
})();

function setListener() {
  // elemCountySelector.addEventListener('change', selectCountyEvent);
  // elemTownSelector.addEventListener('change', selectTownEvent);
};

async function fetchData() {
  try {
    const res = await fetch(dataUrl);
    return result = res.json();
  } catch (e) {
    console.log(e.message);
  };
};

function setJsonData(result) {
  result.forEach(item => {
    jsonData.push(item);
  });
};

function strMaker(temp, data, str = '') {
  data.map((item, i) => {
    str += temp(item, i);
  });
  return str;
};

function setDataArray(arr = []) {
  if (currentCityData !== '' && currentTownData !== '') {
    arr = jsonData.filter(item =>
      item.City === currentCityData && item.Town === currentTownData);
  } else if (currentCityData !== '') {
    arr = jsonData.filter(item =>
      item.City === currentCityData);
  } else {
    arr = jsonData;
  };
  return arr;
};

function textLimit(str, limitStr = '') {
  if (str.length > limitWordLen) {
    limitStr = str.substring(0, limitWordLen - 1) + '...';
    return limitStr;
  };
  return str;
};
