chrome.runtime.onMessage.addListener(function (request) {
    if (request.refreshCoursePage) {
        console.log("REFESH COURSE PAGE")
        logProfessors()
    }
})

function logProfessors() {
    var lectures = document.querySelectorAll("#crse-sections > div > div")
    lectures.forEach(function (lecture) {
        var professor = lecture.querySelector("div > div.panel-body > table > tbody > tr > td:nth-child(4) > a")
        var table = lecture.querySelector("div > div.panel-body > table")
        if (professor != null) {
            console.log(professor.innerText)
            getRating(professor.innerText, table)
        }
    })
}

function getRating(professor, table) {
    professor = professor.split(" ")
    const rateMyProfessor = "https://search-a.akamaihd.net/typeahead/suggest/?solrformat=true&rows=1&q=" + professor[0] + "+" + professor[professor.length - 1] + "+AND+schoolid_s%3A1257&defType=edismax&qf=teacherfirstname_t%5E2000+teacherlastname_t%5E2000+teacherfullname_t%5E2000+autosuggest&bf=pow(total_number_of_ratings_i%2C2.1)&sort=total_number_of_ratings_i+desc&siteName=rmp&rows=20&start=0&fl=pk_id+teacherfirstname_t+teacherlastname_t+total_number_of_ratings_i+averageratingscore_rf+schoolid_s+averageeasyscore_rf&fq="
    console.log(rateMyProfessor)

    var professorStats
    var request = new XMLHttpRequest()
    request.open('GET', rateMyProfessor, true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText)
            professorStats = data.response.docs[0]
            if (professorStats) {
                console.log(professorStats)
                insertRatings(professorStats, table)
            }
        }
    }

    request.send();
}

function insertRatings(professorStats, table) {
    var tableHeader = table.querySelector('thead > tr')

    var overallHeader = document.createElement('th')
    overallHeader.innerText = "Overall"
    tableHeader.appendChild(overallHeader)

    var difficultyHeader = document.createElement('th')
    difficultyHeader.innerText = "Difficulty"
    tableHeader.appendChild(difficultyHeader)

    var totalHeader = document.createElement('th')
    totalHeader.innerText = "#"
    tableHeader.appendChild(totalHeader)

    var tableBody = table.querySelector('tbody > tr')

    var overall = document.createElement('td')
    overall.innerText = professorStats.averageratingscore_rf
    tableBody.appendChild(overall)

    var difficulty = document.createElement('td')
    difficulty.innerText = professorStats.averageeasyscore_rf
    tableBody.appendChild(difficulty)

    var total = document.createElement('td')
    total.innerText = professorStats.total_number_of_ratings_i
    tableBody.appendChild(total)

}