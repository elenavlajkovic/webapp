import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { SubjectsService } from '../services/subjects.service';
import { Router } from '@angular/router';

import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { HttpHeaders } from '@angular/common/http';
import { Test } from '../models/test';

@Component({
  selector: 'app-admin-test-view',
  templateUrl: './admin-test-view.component.html',
  styleUrls: ['./admin-test-view.component.css']
})
export class AdminTestViewComponent {
  constructor(private servis: SubjectsService, private router: Router, private changeDetector: ChangeDetectorRef) { }

  uspeh: String = "";
  poruka: String = "";
  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'timeGridDay',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    eventOverlap: true,
    selectOverlap: true,
    eventClick: this.handleEventClick.bind(this),
    eventAllow: (dropInfo, draggedEvent) => {
      return true;
    },
    selectAllow: (selectInfo) => {
      return true;
    }
  }


  @ViewChild('calendar')
  calendarComponent!: FullCalendarComponent;

  ngAfterViewInit(): void {

    const calendarApi = this.calendarComponent.getApi();

    if (calendarApi) {
      this.servis.dohvIspitneRokove().subscribe(rokovi => {
        rokovi.forEach(rok => {
          const startDate = new Date(rok.pocetak);
          const endDate = new Date(rok.kraj);


          for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const currentDay = new Date(d);

            const startTime = new Date(currentDay);
            startTime.setHours(8, 0, 0);

            const endTime = new Date(currentDay);
            endTime.setHours(21, 0, 0);

            calendarApi.addEvent({
              start: startTime.toISOString(),
              end: endTime.toISOString(),
              display: 'background',
              backgroundColor: 'rgba(0, 128, 0, 0.2)',
              borderColor: 'rgba(0, 128, 0, 0.2)',
              allDay: false
            });
          }
        });
      });

      this.servis.dohvatiZakazaneTermine().subscribe(events => {
        events.forEach(event => {

          const startDateTime = `${event.datum.split('T')[0]}T${event.vreme_pocetka}`;
          const endDateTime = `${event.datum.split('T')[0]}T${event.vreme_kraja}`;

          calendarApi.addEvent({
            title: `${event.predmet} - Sale: ${event.sale}`,
            start: startDateTime,
            end: endDateTime,
            allDay: false,
            backgroundColor: 'orange',
            borderColor: 'orange',
            textColor: 'white'
          });
        });
      });
    }
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Da li ste sigurni da želite da obrišete ispit '${clickInfo.event.title}'?`)) {
      const eventTitle = clickInfo.event.title?.split(' - ')[0] || '';
      const eventSale = clickInfo.event.title?.split(' - ')[1] || '';

      const eventDatum = clickInfo.event.start?.toLocaleDateString('sv-SE') || '';
      const eventVremePocetka = clickInfo.event.start?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) || '';
      const eventVremeKraja = clickInfo.event.end?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) || '';


      this.servis.obrisiTermin(eventTitle, eventDatum, eventVremePocetka, eventVremeKraja, eventSale).subscribe(
        data => {
          clickInfo.event.remove();
          if (data == "ok") {
            this.uspeh = "Termin je uspešno obrisan"
            setTimeout(() => {
              this.uspeh = ""
            }, 2000);
          }
          else {
            this.poruka = data;
            setTimeout(() => {
              this.poruka = ""
            }, 2000);
          }
        },
        (error) => {
          console.error('Greška prilikom brisanja ispita:', error);
        }
      );
    }
  }


  logout() {
    localStorage.setItem('logged', '');
    this.router.navigate([""]);
  }

}
