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
            className='transition bg-discord-black-80 border-2 border-infinitea-orange rounded-lg shadow-xl transition bg-no-repeat bg-center bg-cover hover:scale-103 active:scale-97'
        >
            <div className={`p-6 flex gap-6`}>
                {/* TODO: display missing img placeholder */}
                {props.guild.icon && (
                    <img
                        className='size-16 rounded-lg'
                        src={`https://cdn.discordapp.com/icons/${props.guild.id}/${props.guild.icon}.png`}
                    ></img>
                )}
                <div className='flex-auto min-w-0 h-min overflow-hidden text-xl tracking-tight text-left line-clamp-2'>
                    {props.guild.name}
                </div>
            </div>
        </button >
    );
};
