import { Injectable } from "@nestjs/common";

import type { MigrationsPort } from "../../core/ports/migrations.port";

import { MigrationsAdapter } from "./migrations.adapter";

@Injectable()
export class PostgresAdapter extends MigrationsAdapter implements MigrationsPort {}
