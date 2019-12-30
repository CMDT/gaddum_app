--
-- File generated with SQLiteStudio v3.0.7 on Fri Sep 13 16:04:53 2019
-- 
-- Text encoding used: UTF-8
--
-- Note: Current value for music_provider_settings:client_id is deprecated. App version 0.0.2 will cease to work when this is changed to the new client id.
-- 
PRAGMA foreign_keys = off;
-- BEGIN TRANSACTION;

-- Table: user_settings
DROP TABLE IF EXISTS user_settings;

CREATE TABLE user_settings (
    id                   TEXT NOT NULL
                              PRIMARY KEY
                              REFERENCES settings (id) ON DELETE CASCADE
                                                       ON UPDATE CASCADE
                                                       MATCH SIMPLE,
    friendly_name        TEXT,
    friendly_description TEXT,
    default_value        TEXT
);

INSERT INTO user_settings (
                              id,
                              friendly_name,
                              friendly_description,
                              default_value
                          )
                          VALUES (
                              'collection_play_history',
                              'Collect play history',
                              'Collect and store the tracks you play, and when you play them. On the device only.',
                              'false'
                          );

INSERT INTO user_settings (
                              id,
                              friendly_name,
                              friendly_description,
                              default_value
                          )
                          VALUES (
                              'collection_location_history',
                              'Collect location history',
                              'When collecting and storing the tracks you play, add where you played them. Stored on device only.',
                              'false'
                          );

INSERT INTO user_settings (
                              id,
                              friendly_name,
                              friendly_description,
                              default_value
                          )
                          VALUES (
                              'collection_mood_history',
                              'Collect mood history',
                              'When collecting and storing the tracks you play, add the mood you were in when you played them. Stored on device only.',
                              'false'
                          );

INSERT INTO user_settings (
                              id,
                              friendly_name,
                              friendly_description,
                              default_value
                          )
                          VALUES (
                              'sharing_play_history',
                              'Share play history',
                              'When sharing a track, also share when you have played it.',
                              'false'
                          );

INSERT INTO user_settings (
                              id,
                              friendly_name,
                              friendly_description,
                              default_value
                          )
                          VALUES (
                              'sharing_location_history',
                              'Share location history',
                              'When sharing a track, also share where you have played it.',
                              'false'
                          );

INSERT INTO user_settings (
                              id,
                              friendly_name,
                              friendly_description,
                              default_value
                          )
                          VALUES (
                              'sharing_mood_history',
                              'Share mood history',
                              'When sharing a track, also share the mood you were in when you played it, and if you played all the track.',
                              'false'
                          );


-- Table: supported_connection_states
DROP TABLE IF EXISTS supported_connection_states;

CREATE TABLE supported_connection_states (
    id   INTEGER PRIMARY KEY
                 UNIQUE
                 NOT NULL,
    name TEXT    UNIQUE
                 NOT NULL
);


-- Table: mood_pairings
DROP TABLE IF EXISTS mood_pairings;

CREATE TABLE mood_pairings (
    mood_hot  TEXT PRIMARY KEY
                   REFERENCES base64_resources (id) ON DELETE CASCADE
                                                    ON UPDATE CASCADE
                                                    MATCH SIMPLE
                   UNIQUE
                   NOT NULL,
    mood_cool TEXT REFERENCES base64_resources (id) ON DELETE CASCADE
                                                    ON UPDATE CASCADE
                                                    MATCH SIMPLE
                   UNIQUE
                   NOT NULL
);

INSERT INTO mood_pairings (
                              mood_hot,
                              mood_cool
                          )
                          VALUES (
                              'focussed',
                              'bored'
                          );

INSERT INTO mood_pairings (
                              mood_hot,
                              mood_cool
                          )
                          VALUES (
                              'physical',
                              'tired'
                          );

INSERT INTO mood_pairings (
                              mood_hot,
                              mood_cool
                          )
                          VALUES (
                              'happy',
                              'sad'
                          );

INSERT INTO mood_pairings (
                              mood_hot,
                              mood_cool
                          )
                          VALUES (
                              'crazy',
                              'restful'
                          );

INSERT INTO mood_pairings (
                              mood_hot,
                              mood_cool
                          )
                          VALUES (
                              'angry',
                              'peaceful'
                          );


-- Table: base64_resources
DROP TABLE IF EXISTS base64_resources;

CREATE TABLE base64_resources (
    id        TEXT    PRIMARY KEY
                      NOT NULL
                      UNIQUE,
    content   TEXT,
    is_url    BOOLEAN,
    mime_type TEXT    NOT NULL
);


-- Table: music_provider_settings
DROP TABLE IF EXISTS music_provider_settings;

CREATE TABLE music_provider_settings (
    provider   TEXT   REFERENCES music_providers (id) ON DELETE SET DEFAULT
                                                      ON UPDATE CASCADE
                                                      MATCH SIMPLE
                      NOT NULL,
    id         STRING NOT NULL,
    value      TEXT,
    value_type TEXT   NOT NULL
);

INSERT INTO music_provider_settings (
                                        provider,
                                        id,
                                        value,
                                        value_type
                                    )
                                    VALUES (
                                        'gaddumMusicProviderSpotifyService',
                                        'homepage_url',
                                        'https://www.spotify.com/uk',
                                        'string'
                                    );









INSERT INTO music_provider_settings (
                                        provider,
                                        id,
                                        value,
                                        value_type
                                    )
                                    VALUES (
                                        'gaddumMusicProviderSpotifyService',
                                        'access_token',
                                        NULL,
                                        'string'
                                    );

INSERT INTO music_provider_settings (
                                        provider,
                                        id,
                                        value,
                                        value_type
                                    )
                                    VALUES (
                                        'gaddumMusicProviderSpotifyService',
                                        'refresh_token',
                                        NULL,
                                        'string'
                                    );

INSERT INTO music_provider_settings (
                                        provider,
                                        id,
                                        value,
                                        value_type
                                    )
                                    VALUES (
                                        'gaddumMusicProviderSpotifyService',
                                        'expires_at',
                                        NULL,
                                        'integer'
                                    );

INSERT INTO music_provider_settings (
                                        provider,
                                        id,
                                        value,
                                        value_type
                                    )
                                    VALUES (
                                        'gaddumMusicProviderSpotifyService',
                                        'base64_csv_genre_tags',
                                        'YWNvdXN0aWMsYWZyb2JlYXQsYWx0LXJvY2ssYWx0ZXJuYXRpdmUsYW1iaWVudCxhbmltZSxibGFjay1tZXRhbCxibHVlZ3Jhc3MsYmx1ZXMsYm9zc2Fub3ZhLGJyYXppbCxicmVha2JlYXQsYnJpdGlzaCxjYW50b3BvcCxjaGljYWdvLWhvdXNlLGNoaWxkcmVuLGNoaWxsLGNsYXNzaWNhbCxjbHViLGNvbWVkeSxjb3VudHJ5LGRhbmNlLGRhbmNlaGFsbCxkZWF0aC1tZXRhbCxkZWVwLWhvdXNlLGRldHJvaXQtdGVjaG5vLGRpc2NvLGRpc25leSxkcnVtLWFuZC1iYXNzLGR1YixkdWJzdGVwLGVkbSxlbGVjdHJvLGVsZWN0cm9uaWMsZW1vLGZvbGssZm9ycm8sZnJlbmNoLGZ1bmssZ2FyYWdlLGdlcm1hbixnb3NwZWwsZ290aCxncmluZGNvcmUsZ3Jvb3ZlLGdydW5nZSxndWl0YXIsaGFwcHksaGFyZC1yb2NrLGhhcmRjb3JlLGhhcmRzdHlsZSxoZWF2eS1tZXRhbCxoaXAtaG9wLGhvbGlkYXlzLGhvbmt5LXRvbmssaG91c2UsaWRtLGluZGlhbixpbmRpZSxpbmRpZS1wb3AsaW5kdXN0cmlhbCxpcmFuaWFuLGotZGFuY2Usai1pZG9sLGotcG9wLGotcm9jayxqYXp6LGstcG9wLGtpZHMsbGF0aW4sbGF0aW5vLG1hbGF5LG1hbmRvcG9wLG1ldGFsLG1ldGFsLW1pc2MsbWV0YWxjb3JlLG1pbmltYWwtdGVjaG5vLG1vdmllcyxtcGIsbmV3LWFnZSxuZXctcmVsZWFzZSxvcGVyYSxwYWdvZGUscGFydHkscGhpbGlwcGluZXMtb3BtLHBpYW5vLHBvcCxwb3AtZmlsbSxwb3N0LWR1YnN0ZXAscG93ZXItcG9wLHByb2dyZXNzaXZlLWhvdXNlLHBzeWNoLXJvY2sscHVuayxwdW5rLXJvY2ssci1uLWIscmFpbnktZGF5LHJlZ2dhZSxyZWdnYWV0b24scm9hZC10cmlwLHJvY2sscm9jay1uLXJvbGwscm9ja2FiaWxseSxyb21hbmNlLHNhZCxzYWxzYSxzYW1iYSxzZXJ0YW5lam8sc2hvdy10dW5lcyxzaW5nZXItc29uZ3dyaXRlcixza2Esc2xlZXAsc29uZ3dyaXRlcixzb3VsLHNvdW5kdHJhY2tzLHNwYW5pc2gsc3R1ZHksc3VtbWVyLHN3ZWRpc2gsc3ludGgtcG9wLHRhbmdvLHRlY2hubyx0cmFuY2UsdHJpcC1ob3AsdHVya2lzaCx3b3JrLW91dCx3b3JsZC1tdXNpYw==',
                                        'string'
                                    );

INSERT INTO music_provider_settings (
                                        provider,
                                        id,
                                        value,
                                        value_type
                                    )
                                    VALUES (
                                        'gaddumMusicProviderSpotifyService',
                                        'base64_csv_selected_genre_tags',
                                        NULL,
                                        'string'
                                    );


-- Table: supported_timeslots
DROP TABLE IF EXISTS supported_timeslots;

CREATE TABLE supported_timeslots (
    start_time TIME    UNIQUE
                       NOT NULL,
    end_time   TIME    UNIQUE
                       NOT NULL,
    id         INTEGER PRIMARY KEY AUTOINCREMENT
                       UNIQUE
);

INSERT INTO supported_timeslots (
                                    start_time,
                                    end_time,
                                    id
                                )
                                VALUES (
                                    '00:00:00',
                                    '00:59:59',
                                    1
                                );

INSERT INTO supported_timeslots (
                                    start_time,
                                    end_time,
                                    id
                                )
                                VALUES (
                                    '01:00:00',
                                    '01:59:59',
                                    2
                                );

INSERT INTO supported_timeslots (
                                    start_time,
                                    end_time,
                                    id
                                )
                                VALUES (
                                    '02:00:00',
                                    '02:59:59',
                                    3
                                );

INSERT INTO supported_timeslots (
                                    start_time,
                                    end_time,
                                    id
                                )
                                VALUES (
                                    '03:00:00',
                                    '03:59:59',
                                    4
                                );

INSERT INTO supported_timeslots (
                                    start_time,
                                    end_time,
                                    id
                                )
                                VALUES (
                                    '04:00:00',
                                    '04:59:59',
                                    5
                                );

INSERT INTO supported_timeslots (
                                    start_time,
                                    end_time,
                                    id
                                )
                                VALUES (
                                    '05:00:00',
                                    '05:59:59',
                                    6
                                );

INSERT INTO supported_timeslots (
                                    start_time,
                                    end_time,
                                    id
                                )
                                VALUES (
                                    '06:00:00',
                                    '06:59:59',
                                    7
                                );

INSERT INTO supported_timeslots (
                                    start_time,
                                    end_time,
                                    id
                                )
                                VALUES (
                                    '07:00:00',
                                    '07:59:59',
                                    8
                                );

INSERT INTO supported_timeslots (
                                    start_time,
                                    end_time,
                                    id
                                )
                                VALUES (
                                    '08:00:00',
                                    '08:59:59',
                                    9
                                );

INSERT INTO supported_timeslots (
                                    start_time,
                                    end_time,
                                    id
                                )
                                VALUES (
                                    '09:00:00',
                                    '09:59:59',
                                    10
                                );

INSERT INTO supported_timeslots (
                                    start_time,
                                    end_time,
                                    id
                                )
                                VALUES (
                                    '10:00:00',
                                    '10:59:59',
                                    11
                                );

INSERT INTO supported_timeslots (
                                    start_time,
                                    end_time,
                                    id
                                )
                                VALUES (
                                    '11:00:00',
                                    '11:59:59',
                                    12
                                );

INSERT INTO supported_timeslots (
                                    start_time,
                                    end_time,
                                    id
                                )
                                VALUES (
                                    '12:00:00',
                                    '12:59:59',
                                    13
                                );

INSERT INTO supported_timeslots (
                                    start_time,
                                    end_time,
                                    id
                                )
                                VALUES (
                                    '13:00:00',
                                    '13:59:59',
                                    14
                                );

INSERT INTO supported_timeslots (
                                    start_time,
                                    end_time,
                                    id
                                )
                                VALUES (
                                    '14:00:00',
                                    '14:59:59',
                                    15
                                );

INSERT INTO supported_timeslots (
                                    start_time,
                                    end_time,
                                    id
                                )
                                VALUES (
                                    '15:00:00',
                                    '15:59:59',
                                    16
                                );

INSERT INTO supported_timeslots (
                                    start_time,
                                    end_time,
                                    id
                                )
                                VALUES (
                                    '16:00:00',
                                    '16:59:59',
                                    17
                                );

INSERT INTO supported_timeslots (
                                    start_time,
                                    end_time,
                                    id
                                )
                                VALUES (
                                    '17:00:00',
                                    '17:59:59',
                                    18
                                );

INSERT INTO supported_timeslots (
                                    start_time,
                                    end_time,
                                    id
                                )
                                VALUES (
                                    '18:00:00',
                                    '18:59:59',
                                    19
                                );

INSERT INTO supported_timeslots (
                                    start_time,
                                    end_time,
                                    id
                                )
                                VALUES (
                                    '19:00:00',
                                    '19:59:59',
                                    20
                                );

INSERT INTO supported_timeslots (
                                    start_time,
                                    end_time,
                                    id
                                )
                                VALUES (
                                    '20:00:00',
                                    '20:59:59',
                                    21
                                );

INSERT INTO supported_timeslots (
                                    start_time,
                                    end_time,
                                    id
                                )
                                VALUES (
                                    '21:00:00',
                                    '21:59:59',
                                    22
                                );

INSERT INTO supported_timeslots (
                                    start_time,
                                    end_time,
                                    id
                                )
                                VALUES (
                                    '22:00:00',
                                    '22:59:59',
                                    23
                                );

INSERT INTO supported_timeslots (
                                    start_time,
                                    end_time,
                                    id
                                )
                                VALUES (
                                    '23:00:00',
                                    '23:59:59',
                                    24
                                );


-- Table: playlists_to_profiles
DROP TABLE IF EXISTS playlists_to_profiles;

CREATE TABLE playlists_to_profiles (
    playlist TEXT REFERENCES playlists (id) ON DELETE CASCADE
                                            ON UPDATE CASCADE
                                            MATCH SIMPLE
                  NOT NULL,
    profile  TEXT REFERENCES base64_resources (id) ON DELETE CASCADE
                                                   ON UPDATE CASCADE
                                                   MATCH SIMPLE
                  NOT NULL
);


-- Table: gifted_playlists
DROP TABLE IF EXISTS gifted_playlists;

CREATE TABLE gifted_playlists (
    id           TEXT    REFERENCES playlists (id) ON DELETE CASCADE
                                                   ON UPDATE CASCADE
                                                   MATCH SIMPLE
                         NOT NULL
                         UNIQUE,
    mood_enabled BOOLEAN
);


-- Table: observations
DROP TABLE IF EXISTS observations;

CREATE TABLE observations (
    id            TEXT    PRIMARY KEY
                          UNIQUE
                          NOT NULL,
    timestamp_ms  INTEGER NOT NULL,
    mood_id       TEXT    REFERENCES supported_moods (id) ON DELETE NO ACTION
                                                          ON UPDATE CASCADE
                                                          MATCH SIMPLE,
    timeslot      INTEGER REFERENCES supported_timeslots (id) ON DELETE CASCADE
                                                              ON UPDATE CASCADE
                                                              MATCH SIMPLE
                          NOT NULL,
    location_lat  DOUBLE,
    location_lon  DOUBLE,
    location_code TEXT,
    track_percent INTEGER NOT NULL,
    num_repeats   INTEGER NOT NULL,
    mood_suitable BOOLEAN NOT NULL,
    track         TEXT    REFERENCES tracks (id) ON DELETE CASCADE
                                                 ON UPDATE CASCADE
                                                 MATCH SIMPLE
);


-- Table: supported_input_types
DROP TABLE IF EXISTS supported_input_types;

CREATE TABLE supported_input_types (
    name TEXT PRIMARY KEY
            NOT NULL
            UNIQUE
);

INSERT INTO supported_input_types (
                                      name
                                  )
                                  VALUES (
                                      'boolean'
                                  );

INSERT INTO supported_input_types (
                                      name
                                  )
                                  VALUES (
                                      'integer'
                                  );

INSERT INTO supported_input_types (
                                      name
                                  )
                                  VALUES (
                                      'text'
                                  );


-- Table: track_references
DROP TABLE IF EXISTS track_references;

CREATE TABLE track_references (
    id            TEXT PRIMARY KEY
                       NOT NULL
                       UNIQUE,
    web_uri       TEXT,
    player_uri    TEXT,
    provider_id   TEXT REFERENCES music_providers (id) ON DELETE CASCADE
                                                       ON UPDATE CASCADE
                                                       MATCH SIMPLE,
    thumbnail_uri TEXT,
    track_id      TEXT REFERENCES tracks (id) ON DELETE CASCADE
                                              ON UPDATE CASCADE
                                              MATCH SIMPLE
                       NOT NULL
);


-- Table: tracks
DROP TABLE IF EXISTS tracks;

CREATE TABLE tracks (
    id          TEXT    PRIMARY KEY
                        NOT NULL
                        UNIQUE,
    name        TEXT,
    album       TEXT,
    artist      TEXT,
    duration_ms INTEGER NOT NULL
);


-- Table: music_providers
DROP TABLE IF EXISTS music_providers;

CREATE TABLE music_providers (
    id   TEXT PRIMARY KEY
              UNIQUE
              NOT NULL,
    name TEXT NOT NULL
);

INSERT INTO music_providers (
                                id,
                                name
                            )
                            VALUES (
                                'gaddumMusicProviderSpotifyService',
                                'Spotify'
                            );


-- Table: settings
DROP TABLE IF EXISTS settings;

CREATE TABLE settings (
    id         TEXT UNIQUE
                    NOT NULL
                    PRIMARY KEY,
    value      TEXT,
    value_type TEXT
);

INSERT INTO settings (
                         id,
                         value,
                         value_type
                     )
                     VALUES (
                         'push_device_id',
                         NULL,
                         'string'
                     );

INSERT INTO settings (
                         id,
                         value,
                         value_type
                     )
                     VALUES (
                         'private_key_id',
                         NULL,
                         'string'
                     );

INSERT INTO settings (
                         id,
                         value,
                         value_type
                     )
                     VALUES (
                         'profile_id',
                         NULL,
                         'string'
                     );

INSERT INTO settings (
                         id,
                         value,
                         value_type
                     )
                     VALUES (
                         'public_key_id',
                         NULL,
                         'string'
                     );

INSERT INTO settings (
                         id,
                         value,
                         value_type
                     )
                     VALUES (
                         'music_provider_id',
                         NULL,
                         'string'
                     );

INSERT INTO settings (
                         id,
                         value,
                         value_type
                     )
                     VALUES (
                         'sharing_play_history',
                         NULL,
                         'boolean'
                     );

INSERT INTO settings (
                         id,
                         value,
                         value_type
                     )
                     VALUES (
                         'collection_play_history',
                         NULL,
                         'boolean'
                     );

INSERT INTO settings (
                         id,
                         value,
                         value_type
                     )
                     VALUES (
                         'sharing_location_history',
                         NULL,
                         'boolean'
                     );

INSERT INTO settings (
                         id,
                         value,
                         value_type
                     )
                     VALUES (
                         'collection_location_history',
                         NULL,
                         'boolean'
                     );

INSERT INTO settings (
                         id,
                         value,
                         value_type
                     )
                     VALUES (
                         'sharing_mood_history',
                         NULL,
                         'boolean'
                     );

INSERT INTO settings (
                         id,
                         value,
                         value_type
                     )
                     VALUES (
                         'collection_mood_history',
                         NULL,
                         'boolean'
                     );

INSERT INTO settings (
                         id,
                         value,
                         value_type
                     )
                     VALUES (
                         'first_time_help',
                         NULL,
                         'boolean'
                     );

INSERT INTO settings (
                         id,
                         value,
                         value_type
                     )
                     VALUES (
                         'avatar_graphic',
                         NULL,
                         'string'
                     );

INSERT INTO settings (
                         id,
                         value,
                         value_type
                     )
                     VALUES (
                         'avatar_name',
                         NULL,
                         'string'
                     );

INSERT INTO settings (
                         id,
                         value,
                         value_type
                     )
                     VALUES (
                         'track_selector_max_skips',
                         '5',
                         'integer'
                     );

INSERT INTO settings (
                         id,
                         value,
                         value_type
                     )
                     VALUES (
                         'track_selector_max_track_duration_for_skip_s',
                         '40',
                         'integer'
                     );

INSERT INTO settings (
                         id,
                         value,
                         value_type
                     )
                     VALUES (
                         'track_selector_mood_location_timeslot_suitability_limit',
                         '4',
                         'integer'
                     );

INSERT INTO settings (
                         id,
                         value,
                         value_type
                     )
                     VALUES (
                         'track_selector_mood_unsuitable_limit',
                         '2',
                         'integer'
                     );

INSERT INTO settings (
                         id,
                         value,
                         value_type
                     )
                     VALUES (
                         'track_selector_mood_location_suitability_limit',
                         '3',
                         'integer'
                     );

INSERT INTO settings (
                         id,
                         value,
                         value_type
                     )
                     VALUES (
                         'track_selector_mood_timeslot_suitability_limit',
                         '2',
                         'integer'
                     );

INSERT INTO settings (
                         id,
                         value,
                         value_type
                     )
                     VALUES (
                         'track_selector_timeslot_suitability_limit',
                         '2',
                         'integer'
                     );

INSERT INTO settings (
                         id,
                         value,
                         value_type
                     )
                     VALUES (
                         'track_selector_unobserved_tracks_limit',
                         '2',
                         'integer'
                     );

INSERT INTO settings (
                         id,
                         value,
                         value_type
                     )
                     VALUES (
                         'track_selector_provider_suggestion_limit',
                         '2',
                         'integer'
                     );

INSERT INTO settings (
                         id,
                         value,
                         value_type
                     )
                     VALUES (
                         'track_selector_mood_suitability_limit',
                         '2',
                         'integer'
                     );


-- Table: image_cache
DROP TABLE IF EXISTS image_cache;

CREATE TABLE image_cache (
    web_uri      TEXT NOT NULL
                      UNIQUE
                      PRIMARY KEY,
    base64_image TEXT NOT NULL
);


-- Table: encryption_keys
DROP TABLE IF EXISTS encryption_keys;

CREATE TABLE encryption_keys (
    id         TEXT PRIMARY KEY
                    UNIQUE
                    NOT NULL,
    base64_key TEXT NOT NULL
);


-- Table: supported_face_criteria
DROP TABLE IF EXISTS supported_face_criteria;

CREATE TABLE supported_face_criteria (
    id        TEXT   PRIMARY KEY
                     NOT NULL
                     UNIQUE,
    name      TEXT   NOT NULL,
    range_max DOUBLE,
    range_min DOUBLE
);

INSERT INTO supported_face_criteria (
                                        id,
                                        name,
                                        range_max,
                                        range_min
                                    )
                                    VALUES (
                                        'wink',
                                        'wink',
                                        1,
                                        0
                                    );

INSERT INTO supported_face_criteria (
                                        id,
                                        name,
                                        range_max,
                                        range_min
                                    )
                                    VALUES (
                                        'cocked_eyebrow',
                                        'cocked eyebrow',
                                        1,
                                        0
                                    );

INSERT INTO supported_face_criteria (
                                        id,
                                        name,
                                        range_max,
                                        range_min
                                    )
                                    VALUES (
                                        'lopsided_smile',
                                        'lopsided smile',
                                        1,
                                        0
                                    );

INSERT INTO supported_face_criteria (
                                        id,
                                        name,
                                        range_max,
                                        range_min
                                    )
                                    VALUES (
                                        'smile',
                                        'smile',
                                        1,
                                        0
                                    );

INSERT INTO supported_face_criteria (
                                        id,
                                        name,
                                        range_max,
                                        range_min
                                    )
                                    VALUES (
                                        'both_eyebrows_down',
                                        'both eyebrows down',
                                        1,
                                        0
                                    );

INSERT INTO supported_face_criteria (
                                        id,
                                        name,
                                        range_max,
                                        range_min
                                    )
                                    VALUES (
                                        'both_eyebrows_up',
                                        'both eyebrows up',
                                        1,
                                        0
                                    );

INSERT INTO supported_face_criteria (
                                        id,
                                        name,
                                        range_max,
                                        range_min
                                    )
                                    VALUES (
                                        'both_eyes_closed',
                                        'both eyes closed',
                                        1,
                                        0
                                    );

INSERT INTO supported_face_criteria (
                                        id,
                                        name,
                                        range_max,
                                        range_min
                                    )
                                    VALUES (
                                        'any_eyebrows_down',
                                        'any eyebrows down',
                                        1,
                                        0
                                    );

INSERT INTO supported_face_criteria (
                                        id,
                                        name,
                                        range_max,
                                        range_min
                                    )
                                    VALUES (
                                        'any_eyebrows_up',
                                        'any eyebrows up',
                                        1,
                                        0
                                    );

INSERT INTO supported_face_criteria (
                                        id,
                                        name,
                                        range_max,
                                        range_min
                                    )
                                    VALUES (
                                        'any_eyes_closed',
                                        'any eyes closed',
                                        1,
                                        0
                                    );

INSERT INTO supported_face_criteria (
                                        id,
                                        name,
                                        range_max,
                                        range_min
                                    )
                                    VALUES (
                                        'head_cocked',
                                        'head cocked (0 is centre, only + values)',
                                        1,
                                        0
                                    );

INSERT INTO supported_face_criteria (
                                        id,
                                        name,
                                        range_max,
                                        range_min
                                    )
                                    VALUES (
                                        'rz',
                                        'head cocked-left-ness (0 is centre, left is more +)',
                                        1,
-                                       1
                                    );

INSERT INTO supported_face_criteria (
                                        id,
                                        name,
                                        range_max,
                                        range_min
                                    )
                                    VALUES (
                                        'ry',
                                        'head right-ness (0 is centre, right is more +)',
                                        1,
-                                       1
                                    );

INSERT INTO supported_face_criteria (
                                        id,
                                        name,
                                        range_max,
                                        range_min
                                    )
                                    VALUES (
                                        'rx',
                                        'head down-ness (0 is fully up, down is more +)',
                                        1,
                                        0
                                    );

INSERT INTO supported_face_criteria (
                                        id,
                                        name,
                                        range_max,
                                        range_min
                                    )
                                    VALUES (
                                        'mouthNasty',
                                        'mouth nasty',
                                        1,
                                        0
                                    );

INSERT INTO supported_face_criteria (
                                        id,
                                        name,
                                        range_max,
                                        range_min
                                    )
                                    VALUES (
                                        'eyeLeftClose',
                                        'eye left close',
                                        1,
                                        0
                                    );

INSERT INTO supported_face_criteria (
                                        id,
                                        name,
                                        range_max,
                                        range_min
                                    )
                                    VALUES (
                                        'eyeRightClose',
                                        'eye right close',
                                        1,
                                        0
                                    );

INSERT INTO supported_face_criteria (
                                        id,
                                        name,
                                        range_max,
                                        range_min
                                    )
                                    VALUES (
                                        'mouthRound',
                                        'mouth round',
                                        1,
                                        0
                                    );

INSERT INTO supported_face_criteria (
                                        id,
                                        name,
                                        range_max,
                                        range_min
                                    )
                                    VALUES (
                                        'mouthOpen',
                                        'mouth open',
                                        1,
                                        0
                                    );

INSERT INTO supported_face_criteria (
                                        id,
                                        name,
                                        range_max,
                                        range_min
                                    )
                                    VALUES (
                                        'eyeBrowRightUp',
                                        'eyebrow right up',
                                        1,
                                        0
                                    );

INSERT INTO supported_face_criteria (
                                        id,
                                        name,
                                        range_max,
                                        range_min
                                    )
                                    VALUES (
                                        'eyeBrowLeftUp',
                                        'eyebrow left up',
                                        1,
                                        0
                                    );

INSERT INTO supported_face_criteria (
                                        id,
                                        name,
                                        range_max,
                                        range_min
                                    )
                                    VALUES (
                                        'eyeBrowRightDown',
                                        'eyebrow right down',
                                        1,
                                        0
                                    );

INSERT INTO supported_face_criteria (
                                        id,
                                        name,
                                        range_max,
                                        range_min
                                    )
                                    VALUES (
                                        'eyeBrowLeftDown',
                                        'eyebrow left down',
                                        1,
                                        0
                                    );

INSERT INTO supported_face_criteria (
                                        id,
                                        name,
                                        range_max,
                                        range_min
                                    )
                                    VALUES (
                                        'smileLeft',
                                        'smile left',
                                        1,
                                        0
                                    );

INSERT INTO supported_face_criteria (
                                        id,
                                        name,
                                        range_max,
                                        range_min
                                    )
                                    VALUES (
                                        'smileRight',
                                        'smile right',
                                        1,
                                        0
                                    );


-- Table: profiles
DROP TABLE IF EXISTS profiles;

CREATE TABLE profiles (
    id                TEXT PRIMARY KEY
                           UNIQUE
                           NOT NULL,
    name              TEXT,
    avatar_graphic_id TEXT REFERENCES base64_resources (id) ON DELETE SET NULL
                                                            ON UPDATE CASCADE
);


-- Table: queue
DROP TABLE IF EXISTS queue;

CREATE TABLE queue (
    id        TEXT    PRIMARY KEY
                      NOT NULL
                      UNIQUE,
    timestamp INTEGER NOT NULL,
    item      STRING  NOT NULL,
    type      STRING  NOT NULL
);


-- Table: supported_moods
DROP TABLE IF EXISTS supported_moods;

CREATE TABLE supported_moods (
    id                TEXT PRIMARY KEY ASC ON CONFLICT FAIL
                           NOT NULL,
    name              TEXT NOT NULL
                           UNIQUE,
    icon_resource     TEXT REFERENCES base64_resources (id) ON DELETE SET NULL
                                                            ON UPDATE CASCADE
                                                            MATCH SIMPLE,
    music_resource    TEXT REFERENCES base64_resources (id) ON DELETE SET NULL
                                                            ON UPDATE CASCADE
                                                            MATCH SIMPLE,
    emoticon_resource TEXT
);

INSERT INTO supported_moods (
                                id,
                                name,
                                icon_resource,
                                music_resource,
                                emoticon_resource
                            )
                            VALUES (
                                'peaceful',
                                'Peaceful',
                                NULL,
                                NULL,
                                '😇'
                            );

INSERT INTO supported_moods (
                                id,
                                name,
                                icon_resource,
                                music_resource,
                                emoticon_resource
                            )
                            VALUES (
                                'angry',
                                'Angry',
                                NULL,
                                NULL,
                                '😡'
                            );

INSERT INTO supported_moods (
                                id,
                                name,
                                icon_resource,
                                music_resource,
                                emoticon_resource
                            )
                            VALUES (
                                'restful',
                                'Restful',
                                NULL,
                                NULL,
                                '😌'
                            );

INSERT INTO supported_moods (
                                id,
                                name,
                                icon_resource,
                                music_resource,
                                emoticon_resource
                            )
                            VALUES (
                                'crazy',
                                'Crazy!',
                                NULL,
                                NULL,
                                '😜'
                            );

INSERT INTO supported_moods (
                                id,
                                name,
                                icon_resource,
                                music_resource,
                                emoticon_resource
                            )
                            VALUES (
                                'sad',
                                'Sad',
                                NULL,
                                NULL,
                                '😟'
                            );

INSERT INTO supported_moods (
                                id,
                                name,
                                icon_resource,
                                music_resource,
                                emoticon_resource
                            )
                            VALUES (
                                'happy',
                                'Happy',
                                NULL,
                                NULL,
                                '😀'
                            );

INSERT INTO supported_moods (
                                id,
                                name,
                                icon_resource,
                                music_resource,
                                emoticon_resource
                            )
                            VALUES (
                                'tired',
                                'Tired',
                                NULL,
                                NULL,
                                '😴'
                            );

INSERT INTO supported_moods (
                                id,
                                name,
                                icon_resource,
                                music_resource,
                                emoticon_resource
                            )
                            VALUES (
                                'physical',
                                'Physical',
                                NULL,
                                NULL,
                                '💪'
                            );

INSERT INTO supported_moods (
                                id,
                                name,
                                icon_resource,
                                music_resource,
                                emoticon_resource
                            )
                            VALUES (
                                'bored',
                                'Bored',
                                NULL,
                                NULL,
                                '🙄'
                            );

INSERT INTO supported_moods (
                                id,
                                name,
                                icon_resource,
                                music_resource,
                                emoticon_resource
                            )
                            VALUES (
                                'focussed',
                                'Focused',
                                NULL,
                                NULL,
                                '🤔'
                            );


-- Table: music_provider_mood_to_attributes
DROP TABLE IF EXISTS music_provider_mood_to_attributes;

CREATE TABLE music_provider_mood_to_attributes (
    provider  STRING REFERENCES music_providers (id) ON DELETE CASCADE
                                                     ON UPDATE CASCADE
                                                     MATCH SIMPLE
                     NOT NULL,
    mood      STRING REFERENCES base64_resources (id) ON DELETE CASCADE
                                                      ON UPDATE CASCADE
                                                      MATCH SIMPLE
                     NOT NULL,
    attribute STRING NOT NULL,
    value     STRING NOT NULL,
    type      STRING NOT NULL
);

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'peaceful',
                                                  'acousticness',
                                                  0.7,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'peaceful',
                                                  'danceability',
                                                  0.4,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'peaceful',
                                                  'energy',
                                                  0.3,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'peaceful',
                                                  'instrumentalness',
                                                  0.5,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'peaceful',
                                                  'loudness',
                                                  0.4,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'peaceful',
                                                  'tempo',
                                                  70,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'peaceful',
                                                  'valence',
                                                  0.8,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'angry',
                                                  'acousticness',
                                                  0.2,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'angry',
                                                  'danceability',
                                                  0.8,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'angry',
                                                  'energy',
                                                  0.9,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'angry',
                                                  'instrumentalness',
                                                  0.5,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'angry',
                                                  'loudness',
                                                  0.9,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'angry',
                                                  'tempo',
                                                  120,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'angry',
                                                  'valence',
                                                  0.1,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'restful',
                                                  'acousticness',
                                                  0.7,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'restful',
                                                  'danceability',
                                                  0.1,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'restful',
                                                  'energy',
                                                  0.2,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'restful',
                                                  'instrumentalness',
                                                  0.7,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'restful',
                                                  'loudness',
                                                  0.1,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'restful',
                                                  'tempo',
                                                  60,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'restful',
                                                  'valence',
                                                  0.7,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'crazy',
                                                  'acousticness',
                                                  0.2,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'crazy',
                                                  'danceability',
                                                  0.1,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'crazy',
                                                  'energy',
                                                  1,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'crazy',
                                                  'instrumentalness',
                                                  0.8,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'crazy',
                                                  'loudness',
                                                  1,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'crazy',
                                                  'tempo',
                                                  170,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'crazy',
                                                  'valence',
                                                  0.9,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'sad',
                                                  'acousticness',
                                                  0.2,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'sad',
                                                  'danceability',
                                                  0.3,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'sad',
                                                  'energy',
                                                  0.3,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'sad',
                                                  'instrumentalness',
                                                  0.5,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'sad',
                                                  'loudness',
                                                  0.3,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'sad',
                                                  'tempo',
                                                  80,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'sad',
                                                  'valence',
                                                  0.3,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'happy',
                                                  'acousticness',
                                                  0.2,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'happy',
                                                  'danceability',
                                                  1,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'happy',
                                                  'energy',
                                                  0.7,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'happy',
                                                  'instrumentalness',
                                                  0.5,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'happy',
                                                  'loudness',
                                                  0.6,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'happy',
                                                  'tempo',
                                                  100,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'happy',
                                                  'valence',
                                                  0.9,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'tired',
                                                  'danceability',
                                                  0.2,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'tired',
                                                  'energy',
                                                  0.2,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'tired',
                                                  'loudness',
                                                  0.3,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'tired',
                                                  'tempo',
                                                  50,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'tired',
                                                  'valence',
                                                  0.9,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'physical',
                                                  'acousticness',
                                                  0.2,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'physical',
                                                  'danceability',
                                                  1,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'physical',
                                                  'energy',
                                                  1,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'physical',
                                                  'loudness',
                                                  0.8,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'physical',
                                                  'tempo',
                                                  75,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'physical',
                                                  'valence',
                                                  1,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'bored',
                                                  'acousticness',
                                                  0.9,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'bored',
                                                  'danceability',
                                                  0.1,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'bored',
                                                  'energy',
                                                  0.3,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'bored',
                                                  'instrumentalness',
                                                  0.8,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'bored',
                                                  'loudness',
                                                  0.5,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'bored',
                                                  'tempo',
                                                  30,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'bored',
                                                  'valence',
                                                  0.4,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'focussed',
                                                  'danceability',
                                                  1,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'focussed',
                                                  'energy',
                                                  0.7,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'focussed',
                                                  'instrumentalness',
                                                  0.8,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'focussed',
                                                  'loudness',
                                                  0.6,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'focussed',
                                                  'tempo',
                                                  75,
                                                  'float'
                                              );

INSERT INTO music_provider_mood_to_attributes (
                                                  provider,
                                                  mood,
                                                  attribute,
                                                  value,
                                                  type
                                              )
                                              VALUES (
                                                  'gaddumMusicProviderSpotifyService',
                                                  'focussed',
                                                  'valence',
                                                  0.7,
                                                  'float'
                                              );


-- Table: profiles_to_encryption_keys
DROP TABLE IF EXISTS profiles_to_encryption_keys;

CREATE TABLE profiles_to_encryption_keys (
    id             TEXT PRIMARY KEY
                        UNIQUE
                        NOT NULL,
    profile        TEXT REFERENCES base64_resources (id) ON DELETE CASCADE
                                                         ON UPDATE CASCADE
                                                         MATCH SIMPLE
                        NOT NULL,
    encryption_key TEXT REFERENCES encryption_keys (id) ON DELETE CASCADE
                                                        ON UPDATE CASCADE
                                                        MATCH SIMPLE
                        NOT NULL
);


-- Table: connections
DROP TABLE IF EXISTS connections;

CREATE TABLE connections (
    id                              TEXT    PRIMARY KEY
                                            UNIQUE
                                            NOT NULL,
    connection_state                INTEGER REFERENCES supported_connection_states (id) ON DELETE CASCADE
                                                                                        ON UPDATE SET DEFAULT
                                                                                        MATCH SIMPLE,
    target_profile                  TEXT    REFERENCES base64_resources (id) ON DELETE CASCADE
                                                                             ON UPDATE CASCADE
                                                                             MATCH SIMPLE,
    state_change_timestamp_epoch_ms INTEGER NOT NULL,
    provider_device_id              TEXT    NOT NULL,
    provider_connection_id          TEXT
);


-- Table: criteria_to_moods
DROP TABLE IF EXISTS criteria_to_moods;

CREATE TABLE criteria_to_moods (
    id          TEXT   PRIMARY KEY
                       UNIQUE
                       NOT NULL,
    criteria    TEXT   REFERENCES supported_face_criteria (id) ON DELETE CASCADE
                                                               ON UPDATE CASCADE
                                                               MATCH SIMPLE
                       NOT NULL,
    mood        TEXT   REFERENCES base64_resources (id) ON DELETE CASCADE
                                                        ON UPDATE CASCADE
                                                        MATCH SIMPLE
                       NOT NULL,
    trigger_max DOUBLE,
    trigger_min DOUBLE
);

INSERT INTO criteria_to_moods (
                                  id,
                                  criteria,
                                  mood,
                                  trigger_max,
                                  trigger_min
                              )
                              VALUES (
                                  '3f20eba0-bb93-47aa-bd9f-373081c86db1',
                                  'mouthOpen',
                                  'physical',
                                  0.6,
                                  0.1
                              );

INSERT INTO criteria_to_moods (
                                  id,
                                  criteria,
                                  mood,
                                  trigger_max,
                                  trigger_min
                              )
                              VALUES (
                                  'a4446eff-d4ad-4ca7-be14-4c89f3e4d4e1',
                                  'mouthRound',
                                  'physical',
                                  NULL,
                                  0.5
                              );

INSERT INTO criteria_to_moods (
                                  id,
                                  criteria,
                                  mood,
                                  trigger_max,
                                  trigger_min
                              )
                              VALUES (
                                  'c2819bb0-dd73-41a4-a883-c2e58d59e81d',
                                  'both_eyebrows_up',
                                  'physical',
                                  NULL,
                                  0.3
                              );

INSERT INTO criteria_to_moods (
                                  id,
                                  criteria,
                                  mood,
                                  trigger_max,
                                  trigger_min
                              )
                              VALUES (
                                  'ec8263d0-75c7-4b4a-abd2-6d311b7e274b',
                                  'mouthOpen',
                                  'tired',
                                  NULL,
                                  0.7
                              );

INSERT INTO criteria_to_moods (
                                  id,
                                  criteria,
                                  mood,
                                  trigger_max,
                                  trigger_min
                              )
                              VALUES (
                                  '7f54a6bb-db0e-4211-8b1f-7f18cad1cf97',
                                  'both_eyes_closed',
                                  'tired',
                                  NULL,
                                  0.8
                              );

INSERT INTO criteria_to_moods (
                                  id,
                                  criteria,
                                  mood,
                                  trigger_max,
                                  trigger_min
                              )
                              VALUES (
                                  '1f62822f-48a1-4e12-be15-139822e89db3',
                                  'mouthNasty',
                                  'angry',
                                  NULL,
                                  0.8
                              );

INSERT INTO criteria_to_moods (
                                  id,
                                  criteria,
                                  mood,
                                  trigger_max,
                                  trigger_min
                              )
                              VALUES (
                                  '12d42867-0a4f-408e-a6f2-378611decc81',
                                  'both_eyebrows_down',
                                  'angry',
                                  NULL,
                                  0.6
                              );

INSERT INTO criteria_to_moods (
                                  id,
                                  criteria,
                                  mood,
                                  trigger_max,
                                  trigger_min
                              )
                              VALUES (
                                  'ef86d31a-d439-4548-a605-949f028014bb',
                                  'smile',
                                  'peaceful',
                                  0.2,
                                  0.1
                              );

INSERT INTO criteria_to_moods (
                                  id,
                                  criteria,
                                  mood,
                                  trigger_max,
                                  trigger_min
                              )
                              VALUES (
                                  '1b6c3cb9-2ba7-4081-a51c-d52006a5da42',
                                  'both_eyebrows_up',
                                  'peaceful',
                                  NULL,
                                  0.4
                              );

INSERT INTO criteria_to_moods (
                                  id,
                                  criteria,
                                  mood,
                                  trigger_max,
                                  trigger_min
                              )
                              VALUES (
                                  '0de17458-6d46-4890-b10a-40faeb9a7dc6',
                                  'both_eyes_closed',
                                  'peaceful',
                                  0.5,
                                  0.2
                              );

INSERT INTO criteria_to_moods (
                                  id,
                                  criteria,
                                  mood,
                                  trigger_max,
                                  trigger_min
                              )
                              VALUES (
                                  'a018c3ca-3a0e-45f6-a0e0-099f19282683',
                                  'both_eyes_closed',
                                  'focussed',
                                  0.1,
                                  NULL
                              );

INSERT INTO criteria_to_moods (
                                  id,
                                  criteria,
                                  mood,
                                  trigger_max,
                                  trigger_min
                              )
                              VALUES (
                                  'f45ed165-c60f-47cf-b811-0e8298187b87',
                                  'smile',
                                  'focussed',
                                  0.1,
                                  NULL
                              );

INSERT INTO criteria_to_moods (
                                  id,
                                  criteria,
                                  mood,
                                  trigger_max,
                                  trigger_min
                              )
                              VALUES (
                                  'dfe1654b-90a6-496d-a811-f0b1b1d58f43',
                                  'both_eyebrows_down',
                                  'focussed',
                                  0.9,
                                  0.6
                              );

INSERT INTO criteria_to_moods (
                                  id,
                                  criteria,
                                  mood,
                                  trigger_max,
                                  trigger_min
                              )
                              VALUES (
                                  'b5149dcd-98a3-4cdb-81fa-99a867c4b932',
                                  'both_eyebrows_up',
                                  'happy',
                                  0.6,
                                  0.2
                              );

INSERT INTO criteria_to_moods (
                                  id,
                                  criteria,
                                  mood,
                                  trigger_max,
                                  trigger_min
                              )
                              VALUES (
                                  '475a6523-b789-4629-aee1-26f593f5a565',
                                  'smile',
                                  'happy',
                                  NULL,
                                  0.3
                              );

INSERT INTO criteria_to_moods (
                                  id,
                                  criteria,
                                  mood,
                                  trigger_max,
                                  trigger_min
                              )
                              VALUES (
                                  '39aa229b-f8f8-42e0-a079-eff6cbac32c6',
                                  'both_eyes_closed',
                                  'bored',
                                  NULL,
                                  0
                              );

INSERT INTO criteria_to_moods (
                                  id,
                                  criteria,
                                  mood,
                                  trigger_max,
                                  trigger_min
                              )
                              VALUES (
                                  '10646c92-4de9-4d7b-8278-cf1f5921f1fb',
                                  'cocked_eyebrow',
                                  'bored',
                                  NULL,
                                  0.2
                              );

INSERT INTO criteria_to_moods (
                                  id,
                                  criteria,
                                  mood,
                                  trigger_max,
                                  trigger_min
                              )
                              VALUES (
                                  '72c2737d-f0fb-48a5-a80d-0ec70f4f5b12',
                                  'lopsided_smile',
                                  'bored',
                                  NULL,
                                  0.85
                              );

INSERT INTO criteria_to_moods (
                                  id,
                                  criteria,
                                  mood,
                                  trigger_max,
                                  trigger_min
                              )
                              VALUES (
                                  'aed65ea4-1bff-4555-9ae4-76c0f460fad6',
                                  'smile',
                                  'sad',
                                  0.01,
                                  NULL
                              );

INSERT INTO criteria_to_moods (
                                  id,
                                  criteria,
                                  mood,
                                  trigger_max,
                                  trigger_min
                              )
                              VALUES (
                                  'e1f770fb-37f7-453d-85dd-23a7e1e328b9',
                                  'both_eyebrows_down',
                                  'sad',
                                  0.4,
                                  0.1
                              );

INSERT INTO criteria_to_moods (
                                  id,
                                  criteria,
                                  mood,
                                  trigger_max,
                                  trigger_min
                              )
                              VALUES (
                                  '5c0a22ea-bd77-4a53-be07-bafe193f2384',
                                  'lopsided_smile',
                                  'crazy',
                                  NULL,
                                  0.8
                              );

INSERT INTO criteria_to_moods (
                                  id,
                                  criteria,
                                  mood,
                                  trigger_max,
                                  trigger_min
                              )
                              VALUES (
                                  '4ccc5a73-86c7-4da7-b758-3e66fcee7778',
                                  'wink',
                                  'crazy',
                                  NULL,
                                  0.8
                              );

INSERT INTO criteria_to_moods (
                                  id,
                                  criteria,
                                  mood,
                                  trigger_max,
                                  trigger_min
                              )
                              VALUES (
                                  '86198836-8b93-4d9d-90d6-9b172f1033eb',
                                  'both_eyes_closed',
                                  'restful',
                                  NULL,
                                  0.7
                              );

INSERT INTO criteria_to_moods (
                                  id,
                                  criteria,
                                  mood,
                                  trigger_max,
                                  trigger_min
                              )
                              VALUES (
                                  'c52970ac-6d81-47d8-844f-03987ae8983e',
                                  'smile',
                                  'restful',
                                  0.1,
                                  NULL
                              );


-- Table: playlists_to_tracks
DROP TABLE IF EXISTS playlists_to_tracks;

CREATE TABLE playlists_to_tracks (
    id          TEXT    PRIMARY KEY
                        UNIQUE
                        NOT NULL,
    playlist_id TEXT    REFERENCES playlists (id) ON DELETE CASCADE
                                                  ON UPDATE CASCADE
                                                  MATCH SIMPLE
                        NOT NULL,
    track_id    TEXT    REFERENCES tracks (id) ON DELETE CASCADE
                                               ON UPDATE CASCADE
                                               MATCH SIMPLE
                        NOT NULL,
    [order]     INTEGER NOT NULL
);


-- Table: playlists
DROP TABLE IF EXISTS playlists;

CREATE TABLE playlists (
    id   TEXT PRIMARY KEY
              UNIQUE
              NOT NULL,
    name TEXT
);


-- COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
