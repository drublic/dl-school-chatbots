# Season seed

`season.json` is the workshop calendar for Amateure, Elite-Amateure, and Frauen.

- Base demo races and start lists came from the raceplanner Excel-style seed (stable golden answers: Amateur *Rund um Merken* = 6 riders, *Rund in Rheinbach* cancelled).
- Additional 2026 Straße events were pulled from [rad-net.de Ausschreibungen](https://www.rad-net.de/rad-net-ausschreibungen.htm) (NRW + Ahrweiler), then merged. New races ship with empty start lists unless a prior seed already had riders.

Re-seed Postgres after editing:

```bash
DATABASE_URL=... npm run db:seed
```
