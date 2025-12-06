import type { CassetteSide } from '../types/cassette';

export const cassetteSides: CassetteSide[] = [
  {
    tape_number: '013',
    side_letter: 'A',
    filename: 'Tape013A',
    metadata: {
      album_title: 'The Best of Bluegrass 1940-1941',
      main_artist: 'Bill Monroe & His Blue Grass Boys',
      genre: 'Bluegrass',
      record_date_display: '1940-1941',
      audio_type: 'Mono',
      dolby: 'None',
      tape_selector: 'Normal',
      catalog_number: 'MCA-527'
    },
    sessions: [
      {
        session_code: 'October 1940 Session',
        session_date: 'October 7, 1940',
        location: 'RCA Victor Studio, Chicago',
        session_personnel: [
          { name: 'Bill Monroe', role: 'Mandolin, Vocals', source_key: 'a' },
          { name: 'Cleo Davis', role: 'Guitar', source_key: 'b' },
          { name: 'Tommy Magness', role: 'Fiddle', source_key: 'c' },
          { name: 'Amos Garren', role: 'Bass', source_key: 'd' }
        ],
        tracks: [
          {
            sequence: 1,
            counter_start: 0,
            title: 'Mule Skinner Blues',
            duration_min: 2,
            duration_sec: 48,
            original_text: '1. 000 Mule Skinner Blues (2:48)'
          },
          {
            sequence: 2,
            counter_start: 140,
            title: 'Six White Horses',
            duration_min: 2,
            duration_sec: 52,
            original_text: '2. 140 Six White Horses (2:52)'
          },
          {
            sequence: 3,
            counter_start: 285,
            title: 'Kentucky Waltz',
            duration_min: 3,
            duration_sec: 15,
            vocalist_display: 'Voc: Monroe',
            original_text: '3. 285 Kentucky Waltz (3:15) Voc: Monroe'
          }
        ]
      },
      {
        session_code: 'February 1941 Session',
        session_date: 'February 17, 1941',
        location: 'RCA Victor Studio, Chicago',
        session_personnel: [
          { name: 'Bill Monroe', role: 'Mandolin, Vocals', source_key: 'a' },
          { name: 'Pete Pyle', role: 'Guitar', source_key: 'e' },
          { name: 'Tommy Magness', role: 'Fiddle', source_key: 'c' },
          { name: 'Bill Westbrooks', role: 'Bass', source_key: 'f' }
        ],
        tracks: [
          {
            sequence: 4,
            counter_start: 490,
            title: 'In the Pines',
            duration_min: 2,
            duration_sec: 35,
            original_text: '4. 490 In the Pines (2:35)'
          },
          {
            sequence: 5,
            counter_start: 625,
            title: 'Goodbye Old Pal',
            duration_min: 3,
            duration_sec: 8,
            original_text: '5. 625 Goodbye Old Pal (3:08)'
          }
        ]
      }
    ]
  },
  {
    tape_number: '013',
    side_letter: 'B',
    filename: 'Tape013B',
    metadata: {
      album_title: 'The Best of Bluegrass 1940-1941',
      main_artist: 'Bill Monroe & His Blue Grass Boys',
      genre: 'Bluegrass',
      record_date_display: '1940-1941',
      audio_type: 'Mono',
      dolby: 'None',
      tape_selector: 'Normal',
      catalog_number: 'MCA-527'
    },
    sessions: [
      {
        session_code: null,
        session_date: '1941',
        location: 'RCA Victor Studio, Chicago',
        session_personnel: [
          { name: 'Bill Monroe', role: 'Mandolin, Vocals', source_key: 'a' },
          { name: 'Pete Pyle', role: 'Guitar', source_key: 'e' },
          { name: 'Tommy Magness', role: 'Fiddle', source_key: 'c' },
          { name: 'Bill Westbrooks', role: 'Bass', source_key: 'f' }
        ],
        tracks: [
          {
            sequence: 1,
            counter_start: 0,
            title: 'Heavy Traffic Ahead',
            duration_min: 2,
            duration_sec: 42,
            original_text: '1. 000 Heavy Traffic Ahead (2:42)'
          },
          {
            sequence: 2,
            counter_start: 135,
            title: 'Blue Yodel No. 4',
            duration_min: 3,
            duration_sec: 22,
            vocalist_display: 'Voc: Monroe',
            original_text: '2. 135 Blue Yodel No. 4 (3:22) Voc: Monroe'
          },
          {
            sequence: 3,
            counter_start: 320,
            title: 'Dog House Blues',
            duration_min: 2,
            duration_sec: 58,
            original_text: '3. 320 Dog House Blues (2:58)'
          }
        ]
      }
    ]
  },
  {
    tape_number: '027',
    side_letter: 'A',
    filename: 'Tape027A',
    metadata: {
      album_title: 'Jazz at the Philharmonic',
      main_artist: 'Various Artists',
      genre: 'Jazz',
      record_date_display: '1958',
      audio_type: 'Mono',
      dolby: 'Dolby B',
      tape_selector: 'Chrome',
      catalog_number: 'VERVE-8269'
    },
    sessions: [
      {
        session_code: 'Group A',
        location: 'Carnegie Hall, New York',
        session_date: 'September 29, 1958',
        session_personnel: [
          { name: 'Dizzy Gillespie', role: 'Trumpet', source_key: '1' },
          { name: 'Stan Getz', role: 'Tenor Sax', source_key: '2' },
          { name: 'Oscar Peterson', role: 'Piano', source_key: '3' },
          { name: 'Ray Brown', role: 'Bass', source_key: '4' },
          { name: 'Herb Ellis', role: 'Guitar', source_key: '5' },
          { name: 'Louie Bellson', role: 'Drums', source_key: '6' }
        ],
        tracks: [
          {
            sequence: 1,
            counter_start: 0,
            title: 'Cottontail',
            duration_min: 8,
            duration_sec: 15,
            original_text: '1. 000 Cottontail (8:15)'
          },
          {
            sequence: 2,
            counter_start: 410,
            title: 'How High the Moon',
            duration_min: 11,
            duration_sec: 32,
            original_text: '2. 410 How High the Moon (11:32)'
          }
        ]
      },
      {
        session_code: 'Group B',
        location: 'Carnegie Hall, New York',
        session_date: 'September 29, 1958',
        session_personnel: [
          { name: 'Roy Eldridge', role: 'Trumpet', source_key: '7' },
          { name: 'Coleman Hawkins', role: 'Tenor Sax', source_key: '8' },
          { name: 'Oscar Peterson', role: 'Piano', source_key: '3' },
          { name: 'Ray Brown', role: 'Bass', source_key: '4' },
          { name: 'Herb Ellis', role: 'Guitar', source_key: '5' },
          { name: 'Louie Bellson', role: 'Drums', source_key: '6' }
        ],
        tracks: [
          {
            sequence: 3,
            counter_start: 1105,
            title: 'Sweethearts on Parade',
            duration_min: 6,
            duration_sec: 28,
            original_text: '3. 1105 Sweethearts on Parade (6:28)'
          }
        ]
      }
    ]
  },
  {
    tape_number: '042',
    side_letter: 'A',
    filename: 'Tape042A',
    metadata: {
      album_title: 'Live at the Village Vanguard',
      main_artist: 'John Coltrane Quartet',
      genre: 'Jazz',
      record_date_display: 'November 1961',
      audio_type: 'Stereo',
      dolby: 'Dolby C',
      tape_selector: 'Metal',
      catalog_number: 'IMPULSE-10'
    },
    sessions: [
      {
        session_code: null,
        location: 'Village Vanguard, New York City',
        session_date: 'November 2, 1961',
        session_personnel: [
          { name: 'John Coltrane', role: 'Tenor Saxophone', source_key: 'a' },
          { name: 'McCoy Tyner', role: 'Piano', source_key: 'b' },
          { name: 'Jimmy Garrison', role: 'Bass', source_key: 'c' },
          { name: 'Elvin Jones', role: 'Drums', source_key: 'd' }
        ],
        tracks: [
          {
            sequence: 1,
            counter_start: 0,
            title: 'Spiritual',
            duration_min: 12,
            duration_sec: 45,
            original_text: '1. 000 Spiritual (12:45)'
          },
          {
            sequence: 2,
            counter_start: 638,
            title: 'Softly, as in a Morning Sunrise',
            duration_min: 10,
            duration_sec: 18,
            original_text: '2. 638 Softly, as in a Morning Sunrise (10:18)'
          }
        ]
      }
    ]
  },
  {
    tape_number: '065',
    side_letter: 'A',
    filename: 'Tape065A',
    metadata: {
      album_title: 'The Complete Louis Armstrong Hot Five & Hot Seven',
      main_artist: 'Louis Armstrong',
      genre: 'Jazz / Traditional',
      record_date_display: '1925-1928',
      audio_type: 'Mono',
      dolby: 'None',
      tape_selector: 'Normal',
      catalog_number: 'COLUMBIA-C4L-19'
    },
    sessions: [
      {
        session_code: 'Hot Five - 1926',
        location: 'OKeh Studios, Chicago',
        session_date: 'February 26, 1926',
        session_personnel: [
          { name: 'Louis Armstrong', role: 'Cornet, Vocals', source_key: 'LA' },
          { name: 'Kid Ory', role: 'Trombone', source_key: 'KO' },
          { name: 'Johnny Dodds', role: 'Clarinet', source_key: 'JD' },
          { name: 'Lil Hardin Armstrong', role: 'Piano', source_key: 'LH' },
          { name: 'Johnny St. Cyr', role: 'Banjo', source_key: 'JS' }
        ],
        tracks: [
          {
            sequence: 1,
            counter_start: 0,
            title: 'Muskrat Ramble',
            duration_min: 2,
            duration_sec: 58,
            original_text: '1. 000 Muskrat Ramble (2:58)'
          },
          {
            sequence: 2,
            counter_start: 148,
            title: 'Heebie Jeebies',
            duration_min: 2,
            duration_sec: 52,
            vocalist_display: 'Voc: Armstrong (scat)',
            original_text: '2. 148 Heebie Jeebies (2:52) Voc: Armstrong (scat)'
          }
        ]
      },
      {
        session_code: 'Hot Seven - 1927',
        location: 'OKeh Studios, Chicago',
        session_date: 'May 7, 1927',
        session_personnel: [
          { name: 'Louis Armstrong', role: 'Trumpet, Vocals', source_key: 'LA' },
          { name: 'John Thomas', role: 'Trombone', source_key: 'JT' },
          { name: 'Johnny Dodds', role: 'Clarinet', source_key: 'JD' },
          { name: 'Lil Hardin Armstrong', role: 'Piano', source_key: 'LH' },
          { name: 'Johnny St. Cyr', role: 'Banjo', source_key: 'JS' },
          { name: 'Pete Briggs', role: 'Tuba', source_key: 'PB' },
          { name: 'Baby Dodds', role: 'Drums', source_key: 'BD' }
        ],
        tracks: [
          {
            sequence: 3,
            counter_start: 295,
            title: 'Potato Head Blues',
            duration_min: 3,
            duration_sec: 8,
            original_text: '3. 295 Potato Head Blues (3:08)'
          },
          {
            sequence: 4,
            counter_start: 485,
            title: 'Weary Blues',
            duration_min: 3,
            duration_sec: 18,
            original_text: '4. 485 Weary Blues (3:18)'
          }
        ]
      }
    ]
  },
  {
    tape_number: '089',
    side_letter: 'B',
    filename: 'Tape089B',
    metadata: {
      album_title: 'The Freewheelin\' Bob Dylan',
      main_artist: 'Bob Dylan',
      genre: 'Folk',
      record_date_display: '1962-1963',
      audio_type: 'Stereo',
      dolby: 'Dolby B',
      tape_selector: 'Chrome',
      catalog_number: 'COLUMBIA-CS-8786'
    },
    sessions: [
      {
        session_code: null,
        location: 'Columbia Recording Studios, New York',
        session_date: 'April 24, 1963',
        session_personnel: [
          { name: 'Bob Dylan', role: 'Vocals, Guitar, Harmonica', source_key: 'BD' }
        ],
        tracks: [
          {
            sequence: 1,
            counter_start: 0,
            title: 'Blowin\' in the Wind',
            duration_min: 2,
            duration_sec: 48,
            original_text: '1. 000 Blowin\' in the Wind (2:48)'
          },
          {
            sequence: 2,
            counter_start: 140,
            title: 'Don\'t Think Twice, It\'s All Right',
            duration_min: 3,
            duration_sec: 40,
            original_text: '2. 140 Don\'t Think Twice, It\'s All Right (3:40)'
          },
          {
            sequence: 3,
            counter_start: 360,
            title: 'A Hard Rain\'s A-Gonna Fall',
            duration_min: 6,
            duration_sec: 55,
            original_text: '3. 360 A Hard Rain\'s A-Gonna Fall (6:55)'
          }
        ]
      }
    ]
  }
];
