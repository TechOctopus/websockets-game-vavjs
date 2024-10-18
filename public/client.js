// Heorhi Davydau
const root = document.body;

async function api(endpoint) {
  return await fetch(`/api${endpoint}`)
    .then((res) => res.json())
    .then((data) => data);
}

function renderTag(data) {
  const tag = document.createElement(data.tag);
  if (data.id) tag.id = data.id;
  if (data.class) tag.class = data.class;
  if (data.innerText) tag.innerText = data.innerText;
  if (data.innerHtml) {
    data.innerHtml.forEach((element) => {
      tag.appendChild(renderTag(element));
    });
  }
  return tag;
}

function render(data) {
  data.forEach((element) => {
    root.appendChild(renderTag(element));
  });
}

function getHref() {
  return window.location.pathname;
}

const data = await api(getHref());
render(data);
