Alur alat :
1. Alat connect wifi
2. Alat connect ws
3. Logika alat :
    - Kondisi terbaru pada alat selalu dikirim pada server dalam kondisi apapun
    - Jika api = on dan suhu > 95 maka status alat berjalan (RUN) dan timer mulai dihitung.
    (SUHU REFERENSI AI, bisa diubah)
    - Jika status alat run namun kondisi api = off, maka timer pause dan buzzer hidup serta status alat PAUSE. Jika tombol berwarna merah ditekan, maka buzzer mati. Jika api kembali ada (api = on) maka timer lanjut dan status kembali RUN 
    - Jika suhu >110 maka air_habis = true 
    (REFERENSI AI LONJAKAN SUHU MENANDAKAN AIR MULAI BERKURANG - HABIS). tekan tombol merah untuk mematikan buzzer.
4. Kirim data ke server