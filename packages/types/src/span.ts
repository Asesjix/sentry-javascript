import { Primitive } from './misc';
import { Transaction } from './transaction';

/**
 * The Span Interface specifies a series of timed application events that have a start and end time.
 * @external https://develop.sentry.dev/sdk/event-payloads/span/
 */
export interface SpanContext {
  /**
   * A map or list of tags for this event.
   * Each tag must be less than 200 characters.
   */
  tags?: Record<string, Primitive>;

  /**
   * Determines which trace the Span belongs to.
   * The value should be 16 random bytes encoded as a hex string (32 characters long).
   */
  traceId?: string;

  /**
   * Short code identifying the type of operation the span is measuring.
   */
  op?: string;

  /**
   * Longer description of the span's operation,
   * which uniquely identifies the span but is consistent across instances of the span.
   */
  description?: string;

  /**
   * A timestamp representing when the measuring started.
   */
  startTimestamp?: number;

  /**
   * A timestamp representing when the measuring finished.
   */
  endTimestamp?: number;

  /**
   * Describes the status of the Span/Transaction.
   * See: {@sentry/tracing SpanStatus} for possible values
   */
  status?: string;

  /**
   * Arbitrary data associated with this Span.
   */
  data?: Record<string, unknown>;

  /**
   * Parent Span ID
   */
  parentSpanId?: string;

  /**
   * Span ID
   */
  spanId?: string;

  /**
   * Was this span chosen to be sent as part of the sample?
   */
  sampled?: boolean;
}

/** Span holding trace_id, span_id */
export interface Span extends SpanContext {
  /**
   * @inheritDoc
   */
  spanId: string;

  /**
   * @inheritDoc
   */
  traceId: string;

  /**
   * @inheritDoc
   */
  startTimestamp: number;

  /**
   * @inheritDoc
   */
  tags: Record<string, Primitive>;

  /**
   * @inheritDoc
   */
  data: Record<string, unknown>;

  /**
   * The transaction containing this span
   */
  transaction?: Transaction;

  /**
   * Sets the finish timestamp on the current span.
   * @param endTimestamp Takes an endTimestamp if the end should not be the time when you call this function.
   */
  finish(endTimestamp?: number): void;

  /**
   * Sets the tag attribute on the current span.
   *
   * Can also be used to unset a tag, by passing `undefined`.
   *
   * @param key Tag key
   * @param value Tag value
   */
  setTag(key: string, value: Primitive): this;

  /**
   * Sets the data attribute on the current span
   * @param key Data key
   * @param value Data value
   */
  setData(key: string, value: any): this;

  /**
   * Sets the status attribute on the current span
   * See: {@sentry/tracing SpanStatus} for possible values
   * @param status http code used to set the status
   */
  setStatus(status: string): this;

  /**
   * Sets the status attribute on the current span based on the http code
   * @param httpStatus http code used to set the status
   */
  setHttpStatus(httpStatus: number): this;

  /**
   * Use {@link startChild}
   * @deprecated
   */
  child(
    spanContext?: Pick<SpanContext, Exclude<keyof SpanContext, 'spanId' | 'sampled' | 'traceId' | 'parentSpanId'>>,
  ): Span;

  /**
   * Creates a new `Span` while setting the current `Span.id` as `parentSpanId`.
   * Also the `sampled` decision will be inherited.
   */
  startChild(
    spanContext?: Pick<SpanContext, Exclude<keyof SpanContext, 'spanId' | 'sampled' | 'traceId' | 'parentSpanId'>>,
  ): Span;

  /**
   * Determines whether span was successful (HTTP200)
   */
  isSuccess(): boolean;

  /** Return a traceparent compatible header string */
  toTraceparent(): string;

  /** Convert the object to JSON for w. spans array info only */
  getTraceContext(): {
    data?: { [key: string]: any };
    description?: string;
    op?: string;
    parent_span_id?: string;
    span_id: string;
    status?: string;
    tags?: { [key: string]: Primitive };
    trace_id: string;
  };
  /** Convert the object to JSON */
  toJSON(): {
    data?: { [key: string]: any };
    description?: string;
    op?: string;
    parent_span_id?: string;
    span_id: string;
    start_timestamp: number;
    status?: string;
    tags?: { [key: string]: Primitive };
    timestamp?: number;
    trace_id: string;
  };
}
