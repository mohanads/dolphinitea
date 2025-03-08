import { DiscordGuild } from '../clients/discord';

interface Props {
    guild: DiscordGuild;
    onClick?: (guild: DiscordGuild) => void;
}

export default (props: Props) => {
    const onClick = () => {
        if (props.onClick) props.onClick(props.guild);
    };

    return (
        <button
            onClick={onClick}
            type='button'
            className='p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 transition'
        >
            <div className='h-16 flex'>
                {/* TODO: display missing img placeholder */}
                {props.guild.icon && (
                    <img
                        className='size-16 rounded-lg mr-4'
                        src={`https://cdn.discordapp.com/icons/${props.guild.id}/${props.guild.icon}.png`}
                    ></img>
                )}
                <div className='flex-auto min-w-0 h-min overflow-hidden text-xl tracking-tight text-gray-900 text-left line-clamp-2'>
                    {props.guild.name}
                </div>
            </div>
        </button>
    );
};
