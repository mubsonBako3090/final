/**
 *  * KSU Digital Procurement Requisition System — Database Seed Script
  * -------------------------------------------------------------------------
   * Populates active users across every KASU college/faculty/department
    * (Provost, Dean, HOD, Requester per unit + a full Procurement bench + VC),
     * plus sample requisitions covering the full workflow: draft, pending
      * (at different chain positions, including the postgraduate/basic-studies
       * routing that skips Dean), returned, rejected, and approved requisitions
        * at every Procurement processing stage (ready / processing / completed),
         * including one that trips the ₦10,000,000 Governor-escalation flag.
          *
           * It does NOT create any Admin account — you said you already have those.
            *
             * WHERE TO PUT THIS FILE
              *   Copy this file to  <your-project-root>/scripts/seed.mjs
               *   (it imports your real constants files via a relative path, so the
                *   folder structure must match: scripts/ sitting next to src/).
                 *
                  * SETUP (one-time)
                   *   npm install --save-dev dotenv
                    *
                     * RUN
                      *   node scripts/seed.mjs             # add seed data (safe to re-run; see note below)
                       *   node scripts/seed.mjs --reset     # delete only previously-seeded data, then re-seed
                        *
                         * IMPORTANT — RE-RUNNING WITHOUT --reset
                          *   Every doc this script creates is tagged { seedTag: "ksu-seed-v1" }.
                           *   Running WITHOUT --reset a second time will fail on duplicate emails
                            *   (User.email has a unique index) instead of silently duplicating data.
                             *   Use --reset to wipe and recreate cleanly. --reset only ever deletes
                              *   documents carrying the seed tag, so your real Admin accounts and any
                               *   data created through the app itself are never touched.
                                *
                                 * LOGIN
                                  *   Every seeded user (Requester/HOD/Dean/Provost/VC/Procurement) shares
                                   *   the password printed at the bottom of this file's SEED_PASSWORD const.
                                    *   Every seeded account has accountStatus "active", so you can log in
                                     *   immediately without going through admin approval.
                                      */

                                      import "dotenv/config";
                                      import mongoose from "mongoose";
                                      import bcrypt from "bcryptjs";

                                      import { COLLEGES } from "../src/constants/colleges.js";
                                      import { ROLES } from "../src/constants/roles.js";
                                      import { PROCUREMENT_POSITIONS } from "../src/constants/procurement.js";
                                      import { REQUISITION_STATUS, APPROVAL_ACTIONS } from "../src/constants/requisitionOptions.js";

                                      const SEED_TAG = "ksu-seed-v1";
                                      const SEED_PASSWORD = "KasuSeed#2026";
                                      const NA = "N/A";
                                      const RESET = process.argv.includes("--reset");

                                      const slug = (s) =>
                                        String(s)
                                            .toLowerCase()
                                                .replace(/[^a-z0-9]+/g, "-")
                                                    .replace(/(^-|-$)/g, "");

                                                    async function main() {
                                                      if (!process.env.MONGODB_URI) {
                                                          throw new Error(
                                                                "Missing MONGODB_URI. Make sure .env.local is present and you're running with dotenv loaded (this script already does `import \"dotenv/config\"`, so it reads .env in the project root — copy your MONGODB_URI there or run with `node -r dotenv/config --env-file=.env.local scripts/seed.mjs` on Node 20+)."
                                                                    );
                                                                      }

                                                                        await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
                                                                          const db = mongoose.connection.db;
                                                                            const usersCol = db.collection("users");
                                                                              const requisitionsCol = db.collection("requisitions");
                                                                                const approvalsCol = db.collection("approvals");
                                                                                  const auditLogsCol = db.collection("auditlogs");

                                                                                    console.log(`Connected. Reset mode: ${RESET ? "ON (wiping previous seed data)" : "OFF"}`);

                                                                                      if (RESET) {
                                                                                          const results = await Promise.all([
                                                                                                usersCol.deleteMany({ seedTag: SEED_TAG }),
                                                                                                      requisitionsCol.deleteMany({ seedTag: SEED_TAG }),
                                                                                                            approvalsCol.deleteMany({ seedTag: SEED_TAG }),
                                                                                                                  auditLogsCol.deleteMany({ seedTag: SEED_TAG }),
                                                                                                                      ]);
                                                                                                                          console.log(
                                                                                                                                `Cleared previous seed data: ${results[0].deletedCount} users, ${results[1].deletedCount} requisitions, ${results[2].deletedCount} approvals, ${results[3].deletedCount} audit logs.`
                                                                                                                                    );
                                                                                                                                      }

                                                                                                                                        const now = new Date();
                                                                                                                                          const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);
                                                                                                                                            const userDocs = [];
                                                                                                                                              // Lookup table so requisition-building code can find "the HOD of
                                                                                                                                                // Computer Science" etc. without re-queryingPosition || PROCUREMENT_POSITIONS.PROCUREMENT_OFFICER_II,
                                                                                                                                                                                                  collegeId: collegeId || NA,
                                                                                                                                                                                                        facultyId: facultyId || NA,
                                                                                                                                                                                                              department: department || NA,
                                                                                                                                                                                                                    accountStatus: "active",
                                                                                                                                                                                                                          isSystemAdmin: false,
                                                                                                                                                                                                                                createdAt: now,
                                                                                                                                                                                                                                      updatedAt: now,
                                                                                                                                                                                                                                            seedTag: SEED_TAG,
                                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                                    userDocs.push(doc);
                                                                                                                                                                                                                                                        return doc;
                                                                                                                                                                                                                                                          }
 */
