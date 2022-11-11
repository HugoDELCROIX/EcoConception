fetch("/client/script/test.json").then(
    res => {
        res.json().then(
            data => {
                if (data.length > 0) {
                    var names = ["N/A", "Maintenance", "Conception", "Administration", "Utilisation", "Réalisation", "Fin de vie", "Acquisition", "Déploiement", "Revalorisation"];
                    var temp = "";

                    for (let i = 0; i < names.length; i++) {
                        console.log(names[i]);
                        data.forEach(d => {
                            if (names[i] == d.lifecycle) {
                                temp += "<tr>";
                                temp += "<td>" + d.name + "</td>";
                                temp += "<td>" + d.keystep + "</td>";
                                if (d.indicator == " / ") {
                                    temp += "<td> Pas d'indicateur </td></tr>";
                                } else {
                                    temp += "<td>" + d.indicator + "</td></tr>";
                                }
                                document.getElementById(names[i]).innerHTML = temp;
                            }
                        });
                    }
                };
            }
        )
    }
)