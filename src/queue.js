export default class Queue
{
    /**
     * @type {{}}
     */
    items = {};

    /**
     * @type {number}
     */
    head = 0;

    /**
     * @type {number}
     */
    tail = 0;

    get length()
    {
        return this.tail - this.head;
    }

    get isEmpty()
    {
        return this.length === 0;
    }

    /**
     * @param {any} item
     */
    enqueue(item)
    {
        this.items[this.tail] = item;
        this.tail++;
    }

    /**
     * @returns {any}
     */
    dequeue()
    {
        const item = this.items[this.head];
        delete this.items[this.head];
        this.head++;

        return item;
    }

    /**
     * @returns {any}
     */
    peek()
    {
        return this.items[this.head];
    }
}