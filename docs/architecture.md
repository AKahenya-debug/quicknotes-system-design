# QuickNotes System Architecture

## 1. Introduction

QuickNotes is an online note-taking application designed to support up to 1 million registered users.

The current application uses a browser-based frontend connected to the JSONPlaceholder practice API.

The proposed production system will use a scalable cloud architecture with multiple application servers, caching, a relational database, read replicas and background processing.

The architecture is designed to provide high availability, security, reliability and good performance as the number of users increases.

---

## 2. Functional Requirements

The system must allow users to:

1. Register and log in securely.
2. Create new notes.
3. View and retrieve their notes.
4. Update existing notes.
5. Delete notes.
6. Organize notes using tags.
7. Search for notes using keywords.
8. Access their notes from different devices.
9. Manage their personal account information.

---

## 3. Non-Functional Requirements

### Scalability

The system should support up to 1 million registered users and handle increasing traffic without major performance problems.

### Availability

The application should remain accessible even when an individual application server fails.

### Performance

Most note retrieval requests should complete within 500 milliseconds under normal operating conditions.

### Security

The system must use HTTPS, secure authentication, password hashing and access controls to protect user information.

### Reliability

The database should support backups, replication and recovery in case of failures.

### Maintainability

The application should use modular components that can be updated and maintained independently.

### Data Integrity

The database must maintain accurate relationships between users, notes and tags.

---

## 4. Load Estimates for 1 Million Users

The following estimates use reasonable assumptions for planning purposes.

### Assumptions

- Total registered users: 1,000,000.
- Daily active users: 10% of registered users.
- Daily active users: 100,000.
- Average reads per active user per day: 20.
- Average writes per active user per day: 2.
- Peak traffic is estimated at 5 times the average traffic.
- Average stored note size, including basic metadata: 2 KB.

### Reads Per Second

100,000 active users × 20 reads = 2,000,000 reads per day.

2,000,000 ÷ 86,400 seconds = approximately 23 reads per second.

At peak traffic:

23 × 5 = approximately 116 reads per second.

### Writes Per Second

100,000 active users × 2 writes = 200,000 writes per day.

200,000 ÷ 86,400 seconds = approximately 2.3 writes per second.

At peak traffic:

2.3 × 5 = approximately 12 writes per second.

### Storage Per Year

Assuming 200,000 new notes are created daily:

200,000 × 2 KB = 400,000 KB per day.

400,000 KB × 365 = approximately 146 GB per year.

Allowing approximately 30% additional storage for indexes and database overhead:

146 GB × 1.3 = approximately 190 GB per year.

This estimate covers note data and database overhead, excluding major backup retention and infrastructure logs.

### Estimated Load Summary

| Metric                     | Estimated Value      |
| -------------------------- | -------------------- |
| Registered users           | 1,000,000            |
| Daily active users         | 100,000              |
| Average reads per second   | 23                   |
| Peak reads per second      | 116                  |
| Average writes per second  | 2.3                  |
| Peak writes per second     | 12                   |
| Note storage per year      | 146 GB               |
| Storage including overhead | Approximately 190 GB |

These estimates are planning assumptions and should be adjusted using actual application monitoring data.

---

## 5. System Architecture Diagram

The proposed architecture uses several layers to distribute requests, improve performance and prevent individual component failures from stopping the entire service.

### Architecture Diagram

```text
                 USERS
                   |
                   v
              +---------+
              |   DNS   |
              +---------+
                   |
                   v
              +---------+
              |   CDN   |
              +---------+
                   |
                   v
           +----------------+
           | Load Balancer  |
           +----------------+
                   |
          +--------+--------+
          |                 |
          v                 v
   +-------------+   +-------------+
   | App Server 1|   | App Server 2|
   +-------------+   +-------------+
          |                 |
          +--------+--------+
                   |
          +--------+--------+
          |                 |
          v                 v
     +---------+      +-------------+
     |  Cache  |      |   Primary   |
     | (Redis) |      |  Database   |
     +---------+      +-------------+
                             |
                             v
                       +-------------+
                       | Read Replica|
                       +-------------+

          Application Servers
                   |
                   v
             +-----------+
             |   Queue   |
             +-----------+
                   |
                   v
             +-----------+
             |  Worker   |
             +-----------+
```

---

## 6. Architecture Components and Their Responsibilities

### 1. Client

The client is the web browser or mobile application used by QuickNotes customers.

It provides the interface for creating, viewing, editing and deleting notes.

### 2. DNS (Domain Name System)

DNS translates the QuickNotes domain name into the IP address of the application entry point.

It allows users to access the application using a readable domain name instead of an IP address.

### 3. CDN (Content Delivery Network)

The CDN delivers static resources such as images, CSS and JavaScript from geographically distributed servers.

It reduces latency and decreases the amount of traffic reaching the application servers.

### 4. Load Balancer

The load balancer distributes incoming requests across available application servers.

It prevents one server from receiving all the traffic and performs health checks to avoid sending requests to unhealthy servers.

### 5. Application Servers

The application servers execute the QuickNotes backend logic.

At least two application servers are used so that if one server fails, the other can continue handling requests.

### 6. Cache (Redis)

Redis temporarily stores frequently accessed information, such as recently retrieved notes.

It reduces repeated database queries and improves response times.

### 7. Primary Database

The primary PostgreSQL database stores permanent application data, including users, notes and tags.

It handles write operations and maintains data consistency.

### 8. Read Replica

The read replica maintains a copy of the primary database and handles read-heavy requests.

It reduces the workload on the primary database and improves read scalability.

### 9. Message Queue

The queue stores background tasks that do not need to be completed immediately.

Examples include sending email notifications and processing large exports.

### 10. Background Worker

The worker retrieves tasks from the queue and processes them independently.

It prevents time-consuming background operations from slowing down normal user requests.

---

## 7. GET /notes Request Flow

When a user wants to view their notes, the following process takes place:

1. The user opens QuickNotes and requests their notes.
2. DNS resolves the QuickNotes domain name.
3. The CDN serves cached static resources where available.
4. The load balancer receives the API request and selects a healthy application server.
5. The application server verifies the user's authentication token.
6. The application server checks Redis for the requested notes.
7. If the notes are available in the cache, they are returned immediately.
8. If the cache does not contain the notes, the application server retrieves them from the database read replica.
9. The retrieved notes are stored in Redis for future requests.
10. The application server returns the notes to the client.
11. The browser displays the notes to the user.

---

## 8. POST /notes Request Flow

When a user creates a new note, the following process takes place:

1. The user enters a title and body and submits the form.
2. The client sends a POST /notes request containing JSON data.
3. The load balancer forwards the request to a healthy application server.
4. The application server verifies the user's authentication token.
5. The server validates the note title and body.
6. The application server writes the new note to the primary PostgreSQL database.
7. The database confirms that the note has been saved.
8. The application server invalidates or updates the relevant Redis cache entry.
9. A successful HTTP 201 Created response is returned to the client.
10. The browser displays the newly created note.

If additional work is required, such as sending a notification, the application server can place a task in the message queue for a background worker.

---

## 9. Architecture Trade-offs

### Trade-off 1: SQL Database vs NoSQL Database

QuickNotes uses PostgreSQL instead of a NoSQL database.

Advantages:

- Supports structured relationships.
- Provides foreign keys and data integrity.
- Supports reliable transactions.

Disadvantages:

- Scaling writes across multiple database servers can be more complex.
- Schema changes require planning.

Decision:

PostgreSQL is appropriate because users, notes and tags have clear relationships. Read replicas and caching can help support increasing traffic.

### Trade-off 2: Caching vs Data Consistency

Redis caching improves performance by reducing repeated database queries.

Advantages:

- Faster note retrieval.
- Reduced database workload.
- Better performance during high traffic.

Disadvantages:

- Cached information can become outdated.
- Cache invalidation introduces additional complexity.

Decision:

The system will invalidate or update cached notes whenever a user creates, edits or deletes a note.

### Trade-off 3: Synchronous vs Asynchronous Processing

Some operations can be processed immediately, while others can be handled in the background.

Advantages:

- Background processing reduces response times.
- Workers can process tasks independently.

Disadvantages:

- Queues introduce additional infrastructure.
- Failed background jobs require retry mechanisms.

Decision:

Critical operations such as saving notes will happen synchronously. Non-critical operations such as notifications will use a message queue.

---

## 10. Avoiding Single Points of Failure

A single point of failure is a component whose failure can stop the entire application.

QuickNotes will reduce this risk through the following measures:

1. Multiple application servers will operate behind a load balancer.
2. The load balancer will perform health checks and redirect traffic away from failed servers.
3. Database replication and automated backups will help recover from database failures.
4. Redis will be configured with replication and automatic failover.
5. The message queue will use durable messages and retry mechanisms.
6. Workers will run in multiple instances so that one worker failure does not stop background processing.
7. DNS and CDN services will use highly available provider infrastructure.

The primary database remains a critical dependency, so production deployment should include automated failover to a standby database, tested recovery procedures and regular backups.

---

## 11. Conclusion

The proposed QuickNotes architecture provides a scalable and reliable foundation for supporting one million registered users.

Using multiple application servers, a load balancer, Redis caching, PostgreSQL replication and background workers helps improve performance and availability.

The architecture also separates frontend requests, database operations and background processing, making the application easier to maintain and expand as the number of users grows.
