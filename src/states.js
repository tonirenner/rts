class State
{
    /**
     * @param {Entity|*} entity
     */
    update(entity)
    {
    }

    /**
     * @param {Entity|*} entity
     */
    render(entity)
    {
    }
}

class IdleState extends State
{
}

const States = {
    State,
    IdleState
};

export default States;