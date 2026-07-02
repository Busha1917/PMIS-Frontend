/**
 * eventsStore — shared in-memory store for Events & Visits records.
 *
 * All three role-based pages (Officer, Director General, Assigned Person)
 * read from and write to this singleton so that state transitions made
 * by one role are immediately visible to the next.
 */

import type { EventRecord } from '../../types'
import { events as seedEvents } from '../../data'

type Listener = () => void

class EventsStore {
  private _records: EventRecord[] = [...seedEvents]
  private _listeners: Set<Listener> = new Set()

  /** Subscribe to store changes. Returns an unsubscribe function. */
  subscribe(listener: Listener): () => void {
    this._listeners.add(listener)
    return () => this._listeners.delete(listener)
  }

  private _notify() {
    this._listeners.forEach(l => l())
  }

  /** Get a snapshot of all records. */
  getAll(): EventRecord[] {
    return this._records
  }

  /** Get a single record by id. */
  getById(id: string): EventRecord | undefined {
    return this._records.find(r => r.id === id)
  }

  /** Add a new record. */
  add(record: EventRecord): void {
    this._records = [...this._records, record]
    this._notify()
  }

  /** Replace an existing record by id. */
  update(updated: EventRecord): void {
    this._records = this._records.map(r => (r.id === updated.id ? updated : r))
    this._notify()
  }

  /** Remove a record by id. */
  remove(id: string): void {
    this._records = this._records.filter(r => r.id !== id)
    this._notify()
  }

  /** Upsert — add if new, update if existing. */
  upsert(record: EventRecord): void {
    const exists = this._records.some(r => r.id === record.id)
    if (exists) {
      this.update(record)
    } else {
      this.add(record)
    }
  }
}

export const eventsStore = new EventsStore()
