async function loadData() {
    const url = '/api/profile.php'; // mit korrekter API-URL ersetzen
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error(error);
        return false;
    }
}
const data = await loadData();
console.log(data); // gibt die Daten der API oder false in der Konsole aus

const domfirstName = document.querySelector('#firstName');
const domlastName = document.querySelector('#lastName');

domfirstName.innerHTML = data.first_name;
domlastName.innerHTML = data.last_name;
