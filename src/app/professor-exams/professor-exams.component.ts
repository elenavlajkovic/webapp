import { Component, OnInit, ViewChild } from '@angular/core';
import { SubjectsService } from '../services/subjects.service';
import { Router } from '@angular/router';
import { ExamPeriod } from '../models/exam';
import { ChangeDetectorRef } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { HttpHeaders } from '@angular/common/http';
import { Test } from '../models/test';

@Component({
  selector: 'app-professor-exams',
  templateUrl: './professor-exams.component.html',
  styleUrls: ['./professor-exams.component.css']
})
export class ProfessorExamsComponent implements OnInit {
  constructor(private servis: SubjectsService, private router: Router, private changeDetector: ChangeDetectorRef) { }

  rokovi: ExamPeriod[] = [];
  prikaziKalendar: boolean = false;
  odabraniRok: ExamPeriod = new ExamPeriod();
  poruka: String = "";
  uspeh: String = "";
  zakazao: String = "";

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
    select: this.handleDateSelect.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventOverlap: true,
    selectOverlap: true,
    eventAllow: (dropInfo, draggedEvent) => {
      return true;
    },
    selectAllow: (selectInfo) => {
      return true;
    }

  };
  currentEvents: EventApi[] = [];
  kor_ime: String = ""
  ispiti: Test[] = [];

  @ViewChild('calendar')
  calendarComponent!: FullCalendarComponent;

  ngOnInit(): void {
    this.kor_ime = localStorage.getItem("logged") || '';
    this.servis.dohvIspiteProf(this.kor_ime).subscribe(data => {
      console.log(data)
      this.ispiti = data;
    })
  }

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
            textColor: 'white',
            display: 'background',
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

  handleDateSelect(selectInfo: DateSelectArg) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.zakazao = localStorage.getItem("logged") || '';

    const title = prompt('Unesite šifru ispita koji želite da zakažete');
    if (!title) {
      return;
    }

    const saleInput = prompt('Unesite brojeve sala odvojene zarezima');
    if (!saleInput) {
      return;
    }

    const sale = saleInput.split(',').map(s => parseInt(s.trim(), 10)).filter(s => !isNaN(s));
    if (sale.length === 0) {
      alert('Unesite važeće brojeve sala.');
      return;
    }

    const godineInput = prompt('Unesite godine na kojima se može polagati predmet (odvojene zarezima)');
    if (!godineInput) {
      return;
    }

    const godine = godineInput.split(',').map(g => parseInt(g.trim())).filter(g => !isNaN(g));

    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect();

    this.servis.zakaziTermin(title, new Date(selectInfo.startStr), new Date(selectInfo.startStr), new Date(selectInfo.endStr), sale, godine, this.zakazao, headers)
      .subscribe(data => {
        if (data === "ok") {
          this.uspeh = "Uspešno ste zakazali ispit.";
          setTimeout(() => {
            this.uspeh = ""
          }, 2000);
        } else {
          this.poruka = data;
          setTimeout(() => {
            this.poruka = ""
          }, 2000);
        }
        this.ngAfterViewInit();
      },
        error => {
          this.poruka = "Došlo je do greške prilikom zakazivanja.";
        }
      );
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  logout() {
    localStorage.setItem('logged', '');
    this.router.navigate([""]);
  }
}

