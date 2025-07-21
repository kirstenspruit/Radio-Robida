// AUDIO PLAYER
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".audio").forEach(wrapper => {
    const audio = wrapper.querySelector("audio");
    const playBtn = wrapper.querySelector(".audio__playBtn");

    playBtn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play();
        playBtn.textContent = "Tune out";
      } else {
        audio.pause();
        playBtn.textContent = "Tune in";
      }
    });

    audio.addEventListener("ended", () => {
      playBtn.textContent = "Tune in";
    });
  });
});



// TIMELINE
const events = [];

// === Set your start and end date ===
const startDate = new Date('2025-07-16T00:00:00');
const endDate = new Date('2025-07-23T23:59:59')


// === Events/Markers ===
const timelineBar = document.getElementById('timelineBar');
const dateLabels = document.getElementById('dateLabels');
const markersContainer = document.getElementById('markersContainer');

function formatShortDate(date) {
  return date.toLocaleDateString('en-UK', { weekday: 'short', day: 'numeric' });
}

function getDaysBetween(start, end) {
  const dates = [];
  let current = new Date(start);
  current.setHours(0, 0, 0, 0);
  end = new Date(end);
  end.setHours(0, 0, 0, 0);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

function addDateLabels() {
  const totalDuration = endDate - startDate;
  const days = getDaysBetween(startDate, endDate);

  days.forEach(day => {
    const label = document.createElement('div');
    label.classList.add('date-label');
    label.textContent = formatShortDate(day);

    const timeFromStart = day - startDate;
    let leftPercent = (timeFromStart / totalDuration) * 100;
    leftPercent = Math.max(0, Math.min(leftPercent, 100));

    label.style.left = `${leftPercent}%`;
    dateLabels.appendChild(label);
  });
}

function addMarkers() {
  const totalDuration = endDate - startDate;

  events.forEach(event => {
    const marker = document.createElement('div');
    marker.classList.add('marker');
    const timeSinceStart = event.date - startDate;
    let leftPercent = (timeSinceStart / totalDuration) * 100;
    leftPercent = Math.max(0, Math.min(leftPercent, 100));

    marker.style.left = `${leftPercent}%`;
    marker.innerHTML = `<div class="marker-dot"></div>${event.label}`;
    markersContainer.appendChild(marker);
  });
}

function updateTimeline() {
  const now = new Date();
  const totalDuration = endDate - startDate;
  const elapsed = now - startDate;

  let progress = (elapsed / totalDuration) * 100;
  progress = Math.max(0, Math.min(progress, 100));
  timelineBar.style.width = progress + '%';
}


// ARE.NA SCHEDULE
fetch("https://api.are.na/v2/channels/robida-radio-schedule-test/contents?access_token=eAbi6dA3i-tCZInyJd4VStOtfEJ8EKuvPepCqBhYRW4")
.then((response) => {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error("NETWORK RESPONSE ERROR");
  }
  })
.then(data => {
  getEventData(data)

  addDateLabels();
  addMarkers();
  updateTimeline();
})
.catch((error) => console.error("FETCH ERROR:", error));

function getEventData(data) {
  let x = 0;
  while (x < data.contents.length) {
    events.push({
      date: new Date(data.contents[x].content),
      label: data.contents[x].title
    })
    x++;
  }
}


setInterval(updateTimeline, 1000);
