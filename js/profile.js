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
const familyCode = document.querySelector('#familyCodeValue');

domfirstName.innerHTML = data.first_name;
domlastName.innerHTML = data.last_name;
familyCode.innerHTML = data.family_code;

const leaveFamilyButton = document.querySelector('#leaveFamilyBtn');

leaveFamilyButton.addEventListener('click', async () => {
    const url = '/api/family/deletefamily.php'; // mit korrekter API-URL ersetzen
    try {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include' // Send session cookies
        });
        const result = await response.json();
        console.log(result); // gibt die Daten der API oder false in der Konsole aus
        if (result.status === 'success') {
            alert('Familie erfolgreich verlassen');
            window.location.href = 'familycode.html';
        } else {
            alert('Fehler beim Verlassen der Familie');
        }
    } catch (error) {
        console.error(error);
    }
});
