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
    const searchInput = useRef('');

    const { posts, setPosts, postLoading, postError } = usePosts();
    const { profiles, profileLoading, profileError } = useProfiles();
    const { popUps, addPopUp, removePopUp } = usePopUps();

    useEffect(() => {
        setFilteredProfiles(profiles)
    }, [profiles]);

    useEffect(() => {
        setFilteredPosts(posts);
    }, [posts])

    const [filteredProfiles, setFilteredProfiles] = useState(profiles);
    const [filteredPosts, setFilteredPosts] = useState(posts);
    const [trashHovered, setTrashHovered] = useState('');

    async function createPostHandler(event) {
        event.preventDefault();

        addPopUp('Criando publicação...');

        const content = newPostContent.current.innerText;
        if (content) {
            try {
                const newPost = await createPost(content);

                setPosts(prevPosts => [newPost, ...prevPosts]);
                setUser(prevUser => ({ ...prevUser, postsCount: prevUser.postsCount + 1 }));

                addPopUp('Publicação criada com sucesso!');
                newPostContent.current.innerText = '';
                clearSearch();
            } catch (error) {
                addPopUp(error.message);
            }
        }
    }

    async function deletePostHandler(postId) {
        addPopUp('Apagando publicação...');
        await deletePost(postId);
        const updatedPosts = posts.filter(post => post.id !== postId);

        setPosts(updatedPosts);
        setUser(prevUser => ({ ...prevUser, postsCount: prevUser.postsCount - 1 }));

        clearSearch()
        addPopUp('Publicação removida!')
    }

    function handleSearch() {
        const content = searchInput.current.value;
        if (content) {
            const newFilteredProfiles = profiles.filter(profile => profile.username.startsWith(content))

            if (!newFilteredProfiles.length) {
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
            <ErrorPage />
        )
    }

    return (
        <div className='home-container'>
            <div>
                {popUps.map((message, index) => (<PopUp key={index} message={message} onClose={() => removePopUp(index)} />))}
            </div>
            <div className='profile-container'>
                <button onClick={() => { window.scrollTo(0, 0) }}> <LogoContainer /> </button>
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
                            {user.postsCount + (user.postsCount === 1 ? ' Publicação' : ' Publicações')}
                        </h5>
                    </div>
                </RoundContainer>
                <button onClick={() => { logoutUser(navigate) }} className='logout-button'>
                    Sair
                </button>
            </div>
            <div className='center-container'>
                <RoundContainer extraClasses={'new-post-container'}>
                    <FontAwesomeIcon icon={user.icon} size='3x' />
                    <p contentEditable name='new-post-input' data-placeholder='O que há de novo?'
                        className='new-post-input' ref={newPostContent} />
                    <button onClick={createPostHandler}>Compartilhar</button>
                </RoundContainer>
                <div className='posts-container'>
                    <h3>Novas publicações</h3>
                    {
                        postLoading ? <FontAwesomeIcon icon='circle-notch' spin size='3x' /> :
                            postError ?
                                <RoundContainer>
                                    <h2>{error.message}</h2>
                                    <FontAwesomeIcon icon='triangle-exclamation' bounce size='4x' />
                                    <h3>Não foi possível buscar as publicações</h3>
                                </RoundContainer> :
                                filteredPosts.map(post => (
                                    <RoundContainer key={post.id} extraClasses={'post-container'}>
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
                                                onClick={() => deletePostHandler(post.id)}
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
                                        <p className='post-content'>{post.content}</p>
                                        <Timestamp createdAt={post.createdAt} extraClasses={'subtle-info'} />
                                    </RoundContainer>
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
                {filteredProfiles.length > 0 ? (
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
                        Ninguém encontrado
                    </RoundContainer>
                }
            </div>
        </div >
    )
}

export default Home;