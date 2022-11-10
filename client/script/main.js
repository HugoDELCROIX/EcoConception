fetch("/client/script/test.json").then(
    res => {
        res.json().then(
            data => {
                if (data.length > 0) {
                    var names = ["N/A", "Maintenance", "Conception", "Administration", "Utilisation", "Réalisation", "Fin de vie", "Acquisition", "Déploiement", "Revalorisation"];
                    var temp1 = "";
                    var NA = [];
                    var temp2 = "";

                    for (let i = 0; i < names.length; i++) {
                        temp1 += "<tr>";
                        temp1 += "<th>" + names[i] + "</th>";
                        temp1 += "<th>Étape clef</th>";
                        temp1 += "<th>Indicateur</th></tr>";
                        console.log(names[i].valueOf());
                        data.forEach((u) => {
                                temp2 += "<tr>";
                                temp2 += "<td>" + u.name + "</td>";
                                temp2 += "<td>" + u.keystep + "</td>";
                                if (u.indicator == " / ") {
                                    temp2 += "<td> Pas d'indicateur </td></tr>";
                                } else {
                                    temp2 += "<td>" + u.indicator + "</td></tr>";
                                }
                                document.getElementById("data").innerHTML = temp2;
                            
                        })
                    }
                };
                document.getElementById("head").innerHTML = temp1;

            }
        )
    }
)
