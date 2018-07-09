chrome.runtime.onMessage.addListener(function (request) {
    if (request.refreshCoursePage) {
        getLectures()
    }
})

function getLectures() {
    var lectures = document.querySelectorAll("#crse-sections > div > div")
    lectures.forEach(function (lecture) {
        var professor = lecture.querySelector("div > div.panel-body > table > tbody > tr > td:nth-child(4) > a")
        if (professor) {
            var table = professor.parentNode.parentNode.parentNode.parentNode
            getRating(professor.innerText, table)
        }
    })
}

function getRating(professor, table) {
    professor = professor.split(" ")
    const professorRatings = "https://search-a.akamaihd.net/typeahead/suggest/?solrformat=true&rows=1&q=" + professor[0] + "+" + professor[professor.length - 1] + "+AND+schoolid_s%3A1257&defType=edismax&qf=teacherfirstname_t%5E2000+teacherlastname_t%5E2000+teacherfullname_t%5E2000+autosuggest&bf=pow(total_number_of_ratings_i%2C2.1)&sort=total_number_of_ratings_i+desc&siteName=rmp&rows=20&start=0&fl=pk_id+teacherfirstname_t+teacherlastname_t+total_number_of_ratings_i+averageratingscore_rf+schoolid_s+averageeasyscore_rf&fq="

    var professorStats
    var request = new XMLHttpRequest()
    request.open('GET', professorRatings, true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText)
            professorStats = data.response.docs[0]
            if (professorStats) {
                insertRatings(professorStats, table)
            }
        }
    }

    request.send();
}

function insertRatings(professorStats, table) {
    var tableHeader = table.querySelector('thead > tr')

    var overallHeader = document.createElement('th')
    overallHeader.classList.add('rmpheader')
    overallHeader.innerText = "Overall"
    tableHeader.appendChild(overallHeader)

    var difficultyHeader = document.createElement('th')
    difficultyHeader.classList.add('rmpheader')
    difficultyHeader.innerText = "Difficulty"
    tableHeader.appendChild(difficultyHeader)

    var totalHeader = document.createElement('th')
    totalHeader.classList.add('rmpheader')
    totalHeader.innerText = "# of Reviews"
    tableHeader.appendChild(totalHeader)

    var tableBody = table.querySelector('tbody > tr')

    var overall = document.createElement('td')
    overall.classList.add('rmpcol')
    overall.innerText = professorStats.averageratingscore_rf
    overall.style.color = getOverallColor(professorStats.averageratingscore_rf)
    tableBody.appendChild(overall)

    var difficulty = document.createElement('td')
    difficulty.classList.add('rmpcol')
    difficulty.innerText = professorStats.averageeasyscore_rf
    difficulty.style.color = getDifficultyColor(professorStats.averageeasyscore_rf)
    tableBody.appendChild(difficulty)

    var total = document.createElement('td')
    total.classList.add('rmpcol')
    total.innerText = professorStats.total_number_of_ratings_i
    tableBody.appendChild(total)

}

function getOverallColor(num) {
    if (num >= 3.0) {
        return "#b4d235"
    } else if (num >= 2.0) {
        return "#f7cc20"
    } else {
        return "#df3d5f"
    }
}

function getDifficultyColor(num) {
    if (num >= 4.0) {
        return "#df3d5f"
    } else if (num >= 3.0) {
        return "#f7cc20"
    } else {
        return "#b4d235"
    }
}