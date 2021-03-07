<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar
          flat
        >
          <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="setToday"
          >
            Today
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>

          <v-dialog
            v-model="newEventDialog"
            width="500"
            persistent
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                outlined
                v-bind="attrs"
                v-on="on"
              >
                New Event
              </v-btn>
            </template>

            <v-card
              color="#ECE9D5"
            >
              <v-card-title>
                {{eventDialogTitle}}
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-text-field
                      label="Event Name"
                      v-model="eventName"
                    >
                    </v-text-field>
                  </v-row>
                  <v-row>
                    <v-btn
                      @click="dateDialog = true"
                    >
                      Pick Date
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-label>{{datePicker}}</v-label>
                  </v-row>
                  <v-row>
                    <v-btn
                      @click="startTimeDialog = true"
                    >
                      Pick Start Time
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-label>{{startTime}}</v-label>
                  </v-row>
                  <v-row>
                    <v-btn
                      @click="endTimeDialog = true"
                    >
                      Pick End Time
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-label>{{endTime}}</v-label>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-btn
                  color="secondary"
                  text
                  @click="cancelNewEvent"
                >
                  Cancel
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  text
                  @click="newEvent"
                  :disabled="startTime == null || endTime == null || eventName == '' || datePicker == null"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog
            v-model="dateDialog"
            width="500"
            persistent
          >
            <template>
            <v-card
              color="#ECE9D5"
            >
              <v-card-title>
                Pick Date
              </v-card-title>
              <v-row justify="center">
                <v-date-picker 
                  v-model="datePicker"
                ></v-date-picker>
              </v-row>
              <v-card-actions>
                <v-btn
                  color="secondary"
                  text
                  @click="dateDialog = false"
                >
                  Cancel
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  text
                  @click="dateDialog = false"
                >
                  OK
                </v-btn>
              </v-card-actions>
            </v-card>
            </template>
          </v-dialog>
          <v-dialog
            v-model="startTimeDialog"
            width="500"
            persistent
          >
            <template>
            <v-card
              color="#ECE9D5"
            >
              <v-card-title>
                Pick Start Time
              </v-card-title>
              <v-row justify="center">
                <v-time-picker
                  v-model="startTime"
                  :max="endTime"
                ></v-time-picker>
              </v-row>
              <v-card-actions>
                <v-btn
                  color="secondary"
                  text
                  @click="startTimeDialog = false"
                >
                  Cancel
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  text
                  @click="startTimeDialog = false"
                >
                  OK
                </v-btn>
              </v-card-actions>
            </v-card>
            </template>
          </v-dialog>
          <v-dialog
            v-model="endTimeDialog"
            width="500"
            persistent
          >
            <template>
            <v-card
              color="#ECE9D5"
            >
              <v-card-title>
                Pick End Time
              </v-card-title>
              <v-row justify="center">
                <v-time-picker
                  v-model="endTime"
                  :min="startTime"
                ></v-time-picker>
              </v-row>
              <v-card-actions>
                <v-btn
                  color="secondary"
                  text
                  @click="endTimeDialog = false"
                >
                  Cancel
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  text
                  @click="endTimeDialog = false"
                >
                  OK
                </v-btn>
              </v-card-actions>
            </v-card>
            </template>
          </v-dialog>
          <v-spacer></v-spacer>
          <v-btn 
            outlined
            v-if="type != 'week'"  
            @click="type = 'week'"
          >
            Week
          </v-btn>
          <v-btn 
            outlined
            v-if="type != 'month'"  
            @click="type = 'month'"
          >
            Month
          </v-btn>            
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateEvents"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
              <v-btn icon
                @click="editEvent"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon
                @click="deleteEvent"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-row>
              <v-label>Start Time: {{getTimeString(selectedEvent.start)}}</v-label>
              </v-row>
              <v-row>
              <v-label>End Time: {{getTimeString(selectedEvent.end)}}</v-label>
              </v-row>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>
<script>
  import { v4 as uuidv4 } from 'uuid';
  import { db } from './db';
  export default {
    data: () => ({
      focus: '',
      type: 'month',
      newEventDialog: false,
      dateDialog: false,
      startTimeDialog: false,
      endTimeDialog: false,
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      fireEvents: [],
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
      datePicker: new Date().toISOString().substr(0,10),
      startTime: null,
      endTime: null,
      eventName: "",
      editingEvent: false,
      eventDialogTitle: "New Event",
      eventListId: null,
    }),
    firestore: {
      fireEvents: db.collection('events'),
    },
    mounted () {
      this.$refs.calendar.checkChange()
    },
    methods: {

      getTimeString(time) {
        if(time) {
          var hours = time.getHours().toString();
          if(hours.length < 2) {
            hours = "0" + hours;
          }
          var minutes = time.getMinutes().toString();
          if(minutes.length < 2) {
            minutes = "0" + minutes;
          }
          return hours + ":" + minutes;
        }
        else
          return ""
      },

      cancelNewEvent() {
        this.newEventDialog = false;
        this.eventName = "";
        this.startTime = null;
        this.endTime = null;
        this.datePicker = new Date().toISOString().substr(0,10);
        this.editingEvent = false;
        this.eventDialogTitle = "New Event";
      },

      getDateString(date) {
        return date.getFullYear().toString() +"-"
          + (date.getMonth()+1).toString() +"-"
          + date.getDate().toString();
      },

      updateEvents({start, end}) {
        this.events = []
        db.collection('events').get()
          .then(querySnapshot => {
            const documents = querySnapshot.docs.map(doc => doc.data())
            documents.forEach(doc => {
              var event = ({
                name: doc.name,
                start: new Date(doc.start.seconds*1000),
                end: new Date(doc.end.seconds*1000),
                color: "#356859",
                timed: true,
                uuid: doc.uuid
              })
              this.events.push(event)
            })
          })
      },

      async deleteEvent() {
        this.selectedOpen = false;
        let docId = await this.getDocId(this.selectedEvent.uuid)
        db.collection('events').doc(docId).delete()
        this.updateEvents({start:null, end:null});
      },

      editEvent() {
        this.selectedOpen = false;
        this.eventDialogTitle = "Edit Event";
        this.editingEvent = true;
        this.eventName = this.selectedEvent.name;
        this.startTime = this.getTimeString(this.selectedEvent.start);
        this.endTime = this.getTimeString(this.selectedEvent.end);
        this.datePicker = this.getDateString(this.selectedEvent.start);
        this.newEventDialog = true;
      },

      getDocId(uuid) {
        var id = ""
        return db.collection('events').get()
          .then(querySnapshot => {
            const documents = querySnapshot.docs.map(doc => doc.data())
            querySnapshot.docs.forEach(doc => {
              if(doc.data().uuid == uuid) {
                id = doc.id
              }
            })
            return id
          })
      },

      async newEvent () {
        this.newEventDialog = false;

        var startHour = parseInt(this.startTime.split(":")[0]);
        var startMinute = parseInt(this.startTime.split(":")[1]);
        var endHour = parseInt(this.endTime.split(":")[0]);
        var endMinute = parseInt(this.endTime.split(":")[1]);
        var year = parseInt(this.datePicker.split("-")[0]);
        var month = parseInt(this.datePicker.split("-")[1]);
        var day = parseInt(this.datePicker.split("-")[2]);

        var event = ({
            name: this.eventName,
            start: new Date(year, month-1, day, startHour, startMinute),
            end: new Date(year, month-1, day, endHour, endMinute),
            color: "#356859",
            timed: true,
          })

          if(this.editingEvent) {
            event.uuid = this.selectedEvent.uuid
            let docId = await this.getDocId(event.uuid)
            db.collection('events').doc(docId).set(event)
          }
          else {
            event.uuid = uuidv4();
            db.collection('events').add(event)
          }
          this.updateEvents({start:null, end:null});

    
          this.eventName = "";
          this.startTime = null;
          this.endTime = null;
          this.datePicker = new Date().toISOString().substr(0,10);
          this.editingEvent = false;
          this.eventDialogTitle = "New Event";
          
          // NEED TO REFRESH PAGE?
      },
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = ''
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => {
            this.selectedOpen = true
          }, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      updateRange ({ start, end }) {
        const events = []

        const min = new Date(`${start.date}T00:00:00`)
        const max = new Date(`${end.date}T23:59:59`)
        const days = (max.getTime() - min.getTime()) / 86400000
        const eventCount = this.rnd(days, days + 20)

        for (let i = 0; i < eventCount; i++) {
          const allDay = this.rnd(0, 3) === 0
          const firstTimestamp = this.rnd(min.getTime(), max.getTime())
          const first = new Date(firstTimestamp - (firstTimestamp % 900000))
          const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
          const second = new Date(first.getTime() + secondTimestamp)

          events.push({
            name: this.names[this.rnd(0, this.names.length - 1)],
            start: first,
            end: second,
            color: this.colors[this.rnd(0, this.colors.length - 1)],
            timed: !allDay,
          })
        }

        this.events = events
      },
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
    },
  }
</script>