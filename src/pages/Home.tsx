import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Panel from '../components/Panel';

function Home() {
  return (
    <Container>
      <CssBaseline />
      <Stack direction="row" spacing={2} height="80vh">
        <Panel sx={{ width: '100%', flex: 1 }}>
          <Typography variant="h3">Course Info</Typography>
          <Typography variant="body1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at
            pretium turpis. Aliquam porttitor vitae nulla at dapibus.
          </Typography>
        </Panel>
        <Panel sx={{ width: '100%', flex: 4 }}>
          <Typography variant="h3">Timetable</Typography>
          <Typography variant="body1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at
            pretium turpis. Aliquam porttitor vitae nulla at dapibus. Quisque
            sem ex, sodales sit amet blandit ac, ultrices sit amet nunc.
            Phasellus rhoncus pharetra nisi non molestie. Vivamus vel turpis at
            nisl auctor vestibulum. Vestibulum ante ipsum primis in faucibus
            orci luctus et ultrices posuere cubilia curae; Suspendisse viverra
            tincidunt augue, vel euismod ipsum fermentum et. Proin ac quam
            mollis, pretium massa in, dignissim nibh. Nam tempor odio ac dui
            ornare scelerisque. Morbi feugiat nibh ornare urna eleifend ornare.
            Curabitur at condimentum urna. Sed rutrum turpis consectetur felis
            vestibulum, ut ornare tortor aliquet. Fusce sollicitudin est sit
            amet odio mattis eleifend. Sed fermentum elit ac ligula lobortis
            posuere. Morbi euismod dolor turpis, eget iaculis ipsum facilisis
            vitae. Maecenas fringilla dolor est, eget dictum dolor ultricies at.
            Aliquam ullamcorper varius felis at bibendum. Duis cursus sodales
            nibh. Morbi semper semper iaculis. Duis aliquet ullamcorper nibh.
            Pellentesque tincidunt diam ac urna lacinia molestie. Vestibulum
            iaculis lectus in nisl ullamcorper faucibus. Nunc sed enim vitae
            neque mollis dapibus a vitae erat. Phasellus id porta elit. Nunc
            consequat eget arcu ac porttitor. Vivamus malesuada fringilla
            fringilla. Cras molestie rhoncus est, eget rutrum massa facilisis
            eget. Integer sed massa ac arcu dictum efficitur ut eget ipsum.
            Vestibulum nec nibh et mi aliquam facilisis vel a orci. Nullam sit
            amet velit malesuada, bibendum neque eget, dapibus quam. Sed
            venenatis, nisi ac rhoncus imperdiet, massa metus hendrerit nibh, ac
            varius eros nisl ut massa. Curabitur eget neque ut odio posuere
            dignissim quis sit amet orci. Proin et erat vel sem rhoncus lacinia.
            Nam vitae convallis nisl. Pellentesque quis pellentesque nisl. Fusce
            varius dolor nec consectetur commodo.
          </Typography>
        </Panel>
      </Stack>
    </Container>
  );
}

export default Home;
