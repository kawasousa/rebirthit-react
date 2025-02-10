import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../../assets/icons/project-icons'
import { useEffect, useRef, useState } from 'react'
import { usePosts } from '../../hooks/UsePosts'
import { useProfiles } from '../../hooks/useProfiles'
import { usePopUps } from '../../hooks/UsePopUps'
import RoundContainer from '../../components/RoundContainer'
import LogoContainer from '../../components/LogoContainer'
import Timestamp from '../../components/Timestamp'
import PopUp from '../../components/PopUp'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, logoutUser } from '../../services/authService'
import { createPost, deletePost } from '../../services/PostService'
import ErrorPage from '../ErrorPage'

function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function checkAuth() {
            const userData = await getCurrentUser();
            if (!userData) navigate('/login');
            else setUser(userData);
        }
        checkAuth()

    }, [navigate]);

    const newPostContent = useRef('');
    const newPostTitle = useRef('');
    const searchInput = useRef('');

    const { posts, setPosts, postLoading, postError } = usePosts();
    const { profiles, profileLoading, profileError } = useProfiles();
    const { popUps, addPopUp, removePopUp } = usePopUps();

    const interactionIcons = ['thumbs-up', 'thumbs-down', 'face-grin-squint-tears', 'face-surprise']
    const interactionType = {
        "thumbs-up": "Like",
        "thumbs-down": "Dislike",
        "face-grin-squint-tears": "Laugh",
        "face-surprise": "Surprise"
    }

    useEffect(() => {
        if (profiles) setFilteredProfiles(profiles)
    }, [profiles]);

    useEffect(() => {
        if (posts) setFilteredPosts(posts);
    }, [posts])

    useEffect(() => {
        if ((window.matchMedia("(max-width: 1625px)").matches)) addPopUp('Tente uma tela maior para uma experiência completa!');
    }, [])

    const [filteredProfiles, setFilteredProfiles] = useState(profiles || []);
    const [filteredPosts, setFilteredPosts] = useState(posts || []);
    const [trashHovered, setTrashHovered] = useState('');
    const [isAdvancedPost, setIsAdvancedPost] = useState(false);

    const [interaction, setInteraction] = useState({ icon: null, postId: null });

    async function createPostHandler(event) {
        event.preventDefault();
        addPopUp('Criando publicação...');

        const content = newPostContent.current.value;
        if (content) {
            try {
                const newPost = await createPost(content, isAdvancedPost, newPostTitle.current.value || undefined);

                setPosts(prevPosts => [newPost, ...prevPosts]);
                setUser(prevUser => ({ ...prevUser, postsCount: prevUser.postsCount + 1 }));

                addPopUp('Publicação criada com sucesso!');
                newPostContent.current.value = '';
                newPostTitle.current.value = '';
                clearSearch();
            } catch (error) {
                addPopUp(error.message);
            }
        }
        else addPopUp('Escreva algo para compartilhar')
    }

    async function deletePostHandler(postId, username, interactions) {
        addPopUp('Apagando publicação...');
        await deletePost(postId, interactions || undefined);
        const updatedPosts = posts.filter(post => post.id !== postId);

        setPosts(updatedPosts);
        if (username === user.username)
            setUser(prevUser => ({ ...prevUser, postsCount: prevUser.postsCount - 1 }));

        clearSearch()
        addPopUp('Publicação removida!')
    }

    function handleSearch() {
        const content = searchInput.current.value;
        if (content) {
            const newFilteredProfiles = profiles.filter(profile => profile.username.startsWith(content))

            if (!newFilteredProfiles || !newFilteredProfiles.length) {
                setFilteredProfiles([]);
                setFilteredPosts(posts);
            }
            else {
                const filteredProfilesUsernames = newFilteredProfiles.map(user => user.username);

                setFilteredPosts(posts => posts.filter(post => filteredProfilesUsernames.includes(post.usernameOwner)));
                setFilteredProfiles(newFilteredProfiles);
            }
        }
        else setFilteredProfiles(profiles);
    }

    function clearSearch() {
        searchInput.current.value = '';
        setFilteredPosts(posts);
        setFilteredProfiles(profiles)
    }

    if (!user) {
        return (
            <ErrorPage message={'Tentando carregar seu usuário...'} />
        )
    }

    return (
        <div className='home-container'>
            <div>
                {popUps.map((message, index) => (<PopUp key={index} message={message} onClose={() => removePopUp(index)} />))}
            </div>
            <div className='profile-container'>
                <div className='profile-container-header' >
                    <button onClick={() => { window.scrollTo(0, 0) }}> <LogoContainer /> </button>
                    <button onClick={() => { searchInput.current.value = user.username; handleSearch() }} >
                        <RoundContainer extraClasses={'profile-info-container'}>
                            <FontAwesomeIcon icon={user.icon} size='4x' />
                            <div>
                                <h3>{user.name} &nbsp;
                                    {user.role === 'Admin' &&
                                        <FontAwesomeIcon icon='circle-check' />
                                    }
                                </h3>
                                <h5 className='subtle-info'> @{user.username} </h5>
                                <h5>
                                    {user.postsCount} &nbsp; {(user.postsCount === 1 ? 'Publicação' : 'Publicações')}
                                </h5>
                            </div>
                        </RoundContainer>
                    </button>
                </div>
                <button onClick={() => { logoutUser(navigate) }} className='logout-button'>
                    Sair
                </button>
            </div>
            <div className='center-container'>
                <form className='new-post-container' onSubmit={createPostHandler}>
                    <div className='new-post-header'>
                        <FontAwesomeIcon icon={user.icon} size='2x' />
                        <input type="text" placeholder='Algum título?' ref={newPostTitle} />
                    </div>
                    <input type="text" className='new-post-content'
                        ref={newPostContent}
                        placeholder='O que há de novo?' />
                    <div className='new-post-footer'>
                        <button type='button' className='toggle-advanced-post-button' data-placeholder={isAdvancedPost ? 'avançado' : 'comum'} onClick={() => setIsAdvancedPost(prev => !prev)} >
                            <FontAwesomeIcon icon={isAdvancedPost ? 'heart-circle-check' : 'heart-circle-xmark'} size='2x' />
                        </button>
                        <button className='send-post-button'>compartilhar</button>
                    </div>
                </form>
                <div className='posts-container'>
                    <h3>Novas publicações</h3>
                    {
                        postLoading ? <FontAwesomeIcon icon='circle-notch' spin size='3x' /> :
                            postError ?
                                <RoundContainer>
                                    <h2>{postError.message}</h2>
                                    <FontAwesomeIcon icon='triangle-exclamation' bounce size='4x' />
                                    <h3>Não foi possível buscar as publicações</h3>
                                </RoundContainer> :
                                filteredPosts.map(post => (
                                    <div key={post.id}
                                        className={`post-container ${trashHovered === post.id ? 'trash-hovered' : ''}
                                    `}
                                        style={post.content.includes('@' + user.username) || post.content.includes('@everyone') ?
                                            { borderBottom: "2px solid green" } : {}}
                                    >
                                        <div>
                                            <div className='post-profile-container'>
                                                <FontAwesomeIcon icon={post.iconOwner} size='2x' />
                                                <p>
                                                    {post.nameOwner} &nbsp;
                                                    {
                                                        post.roleOwner === 'Admin' &&
                                                        <FontAwesomeIcon icon='circle-check' />
                                                    }
                                                </p>
                                                <p className='subtle-info'>| &nbsp; @{post.usernameOwner}</p>
                                            </div>
                                            <button
                                                className='post-container-trash'
                                                onClick={() => deletePostHandler(post.id, post.usernameOwner, post.interactions)}
                                                onMouseEnter={() => { setTrashHovered(post.id) }}
                                                onMouseLeave={() => { setTrashHovered('') }}
                                            >
                                                {(user.role === 'Admin' || post.usernameOwner === user.username) &&
                                                    <FontAwesomeIcon
                                                        icon='trash'
                                                        bounce={trashHovered === post.id}
                                                    />
                                                }
                                            </button>
                                        </div>
                                        <div className={`post-content
                                        ${post.interactions ? 'advanced' : ''} 
                                        ${post.title ? 'titled' : ''}
                                        `}>
                                            {post.title && <h3>{post.title}</h3>}
                                            <p>
                                                {post.content}
                                            </p>
                                        </div>
                                        <div className='interaction-container'>
                                            {
                                                post.interactions &&
                                                interactionIcons.map((icon, index) => {
                                                    return (
                                                        <button key={index} type='button'
                                                            className={`selected-interaction`}
                                                            onClick={() => { }}>
                                                            <FontAwesomeIcon icon={icon} size='2x' />
                                                        </button>
                                                    )
                                                })
                                            }
                                        </div>
                                        <Timestamp createdAt={post.createdAt} extraClasses={'subtle-info'} />
                                    </div>
                                ))
                    }
                </div>
            </div>
            <div className="search-container">
                <div>
                    <input type='text' name='search-input'
                        placeholder='Filtrar por perfil...'
                        ref={searchInput}
                        onChange={handleSearch}
                    />
                    {(searchInput.current.value) &&
                        <button onClick={clearSearch}>
                            <FontAwesomeIcon icon='filter-circle-xmark' />
                        </button>
                    }
                </div>
                {filteredProfiles && filteredProfiles.length > 0 ? (
                    profileLoading ? <FontAwesomeIcon icon='circle-notch' spin /> :
                        profileError ?
                            <RoundContainer>
                                <h2>{error.message}</h2>
                                <FontAwesomeIcon icon='triangle-exclamation' bounce size='4x' />
                                <h3>Não foi possível buscar os perfis!</h3>
                            </RoundContainer> :
                            <RoundContainer>
                                <div className="profiles-container">
                                    {
                                        filteredProfiles.map(profile => (
                                            <div key={profile.id}>
                                                <FontAwesomeIcon icon={profile.icon} />
                                                <p>{profile.name}</p>
                                                <p className='subtle-info'>@{profile.username}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            </RoundContainer>
                ) :
                    <RoundContainer>
                        <FontAwesomeIcon icon='person-circle-question' size='2x' /> &nbsp;
                        ninguém por aqui!
                    </RoundContainer>
                }
            </div>
        </div >
    )
}

export default Home;