<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
    <v-app-bar-title>Book B3</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <Booking/>
    </v-main>
  </v-app>
</template>

<script>
import Booking from './components/Booking';
export default {
  name: 'App',

  components: {
    Booking,
  },

  data: () => ({
    //
  }),
};
</script>
