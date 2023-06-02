import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { navbarLogo } from '../utils/utils';
import { getCharities, getCharityFromName, updateCharityInfo } from '../api/getCharityData';
import { getCoordinates } from '../api/getLocation';
import { verifyToken } from '../api/getUsers';

/* Referenced
    https://www.section.io/engineering-education/creating-a-modal-dialog-with-tailwind-css/
  */
function SuccessRegisterModal({ orgID }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <FontAwesomeIcon
              icon={faCircleCheck}
              color="white"
              className="text-4xl"
            />
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900" data-testid="successStatement">
            Successful!
          </h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Charity Information has been successfully updated!
            </p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              type="button"
              onClick={() => navigate(`/charities/${orgID}`)}
              id="ok-btn"
              className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              Back to charity description profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

SuccessRegisterModal.propTypes = {
  orgID: PropTypes.string,
};

SuccessRegisterModal.defaultProps = {
  orgID: '',
};

function EditCharityProfilePage() {
  const [registered, setRegistered] = useState('fail');
  const orgname = useRef('');
  const address = useRef('');
  const state = useRef('');
  const city = useRef('');
  const zip = useRef('');
  const email = useRef('');
  const password = useRef('');
  const website = useRef('');
  const twitter = useRef('');
  const instagram = useRef('');
  const item1 = useRef('');
  const item2 = useRef('');
  const item3 = useRef('');

  const name = useParams().orgID;
  const charityInfoObject = useRef({});

  const updateUsr = useRef(name);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      // attempt to retrieve token
      const token = sessionStorage.getItem('app-token');
      // check if token exists
      if (token) {
        const isVerified = await verifyToken();
        if (!isVerified) {
          navigate('/', { replace: true });
        }
      } else {
        navigate('/', { replace: true });
      }
    };
    checkLogin();
  }, []);

  const getCharityInfo = async () => {
    try {
      const charityInfo = await getCharityFromName(name);
      charityInfoObject.current = charityInfo;
      return charityInfo;
    } catch {
      return {};
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'orgname') {
      orgname.current = e.target.value;
    }

    if (e.target.name === 'addr') {
      address.current = e.target.value;
    }

    if (e.target.name === 'state') {
      state.current = e.target.value;
    }

    if (e.target.name === 'city') {
      city.current = e.target.value;
    }

    if (e.target.name === 'zip') {
      zip.current = e.target.value;
    }

    if (e.target.name === 'email') {
      email.current = e.target.value;
    }

    if (e.target.name === 'pwd') {
      password.current = e.target.value;
    }

    if (e.target.name === 'website') {
      website.current = e.target.value;
    }

    if (e.target.name === 'twitter') {
      twitter.current = e.target.value;
    }

    if (e.target.name === 'instagram') {
      instagram.current = e.target.value;
    }

    if (e.target.name === 'item1') {
      item1.current = e.target.value;
    }

    if (e.target.name === 'item2') {
      item2.current = e.target.value;
    }

    if (e.target.name === 'item3') {
      item3.current = e.target.value;
    }
  };

  const validateCredential = async (accountType) => {
    try {
      const users = await getCharities();
      let i = 0;

      for (i = 0; i < users.length; i += 1) {
        if (users[i].type === accountType && email.current === users[i].email) {
          return 'email';
        }
      }
      return 'success';
    } catch (err) {
      // console.log('error-');
      return 'error';
    }
  };

  const performUpdate = async () => {
    try {
      const msg = await validateCredential('charity');
      if (msg === 'email') {
        setRegistered('usedEmail');
      } else {
        const original = await getCharityInfo();
        const socialMedias = [];
        const items = original.items || [];

        if (twitter.current) {
          socialMedias.push({
            social_media: 'twitter',
            link: twitter.current,
          });
        } else {
          for (let i = 0; i < original.social_medias.length; i += 1) {
            if (original.social_medias[i].social_media === 'twitter') {
              socialMedias.push({
                social_media: 'twitter',
                link: original.social_medias[i].link,
              });
              break;
            }
          }
        }

        if (instagram.current) {
          socialMedias.push({
            social_media: 'instagram',
            link: instagram.current,
          });
        } else {
          for (let i = 0; i < original.social_medias.length; i += 1) {
            if (original.social_medias[i].social_media === 'instagram') {
              socialMedias.push({
                social_media: 'instagram',
                link: original.social_medias[i].link,
              });
              break;
            }
          }
        }

        if (item1.current) {
          items[0] = {
            item: item1.current.split(',', 2)[0],
            needed: Number(item1.current.split(',', 2)[1]),
            received: 0,
          };
        } else {
          items[0] = {
            item: original.items[0].item,
            needed: original.items[0].needed,
            received: original.items[0].received,
          };
        }

        if (item2.current) {
          items[1] = {
            item: item2.current.split(',', 2)[0],
            needed: Number(item2.current.split(',', 2)[1]),
            received: 0,
          };
        } else {
          items[1] = {
            item: original.items[1].item,
            needed: original.items[1].needed,
            received: original.items[1].received,
          };
        }

        if (item3.current) {
          items[2] = {
            item: item1.current.split(',', 2)[0],
            needed: Number(item1.current.split(',', 2)[1]),
            received: 0,
          };
        } else {
          items[2] = {
            item: original.items[2].item,
            needed: original.items[2].needed,
            received: original.items[2].received,
          };
        }

        let coordinates = {};

        if (address.current && city.current && state.current) {
          coordinates = await getCoordinates(`${address.current} ${city.current}, ${state.current}`);
        } else {
          coordinates = original.coordinates;
        }

        let updateCharity = {
          orgname: orgname.current,
          address: address.current,
          state: state.current,
          city: city.current,
          zip: zip.current,
          email: email.current,
          password: password.current,
          website: website.current,
          social_medias: socialMedias,
          items,
          coordinates,
        };

        updateCharity = Object.fromEntries(
          Object.entries(updateCharity).filter((l) => l[1]),
        ); // https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript

        await updateCharityInfo(original.rank, updateCharity);
        setRegistered('success');
      }
      return true;
    } catch (err) {
      // console.log('ERROR HAPPENED: ', err);
      return err;
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    await performUpdate();
  };

  let message = '';

  if (registered === 'usedEmail') {
    message = 'The email is already associated with another account';
  }

  if (registered === 'usedUsername') {
    message = 'Username is already taken';
  }

  return (
    <>
      <nav className="absolute bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded">
        <div className="container flex flex-wrap items-center justify-between mx-auto">
          <a className="flex items-center" href="/">
            <img
              src={navbarLogo}
              className="h-6 mr-3 sm:h-9"
              alt="Charity Express Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap">
              Charity Express
            </span>
          </a>
        </div>
      </nav>
      {registered === 'success' && <SuccessRegisterModal orgID={updateUsr.current} />}
      <div className="bg-grey-lighter min-h-screen flex flex-col">
        <div className="border-5 border-sky-500 container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
          <div className="w-full bg-white rounded-lg shadow dark:border p-3">
            <h4 className="mb-8 text-xl font-medium text-center">
              Edit Profile
            </h4>
            <form name="myForm" className="space-y-4 md:space-y-6" action="#">
              <div className="flex items-center">
                <label className="mr-3" htmlFor="usr">
                  {' '}
                  Organization Name:
                  {' '}
                </label>
                <input
                  autoComplete="on"
                  type="text"
                  name="orgname"
                  id="orgname"
                  data-testid="orgname"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center">
                <label className="mr-3" htmlFor="email">
                  {' '}
                  Email Address:
                  {' '}
                </label>
                <input
                  autoComplete="on"
                  type="email"
                  name="email"
                  id="email"
                  data-testid="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 focus:ring-primary-600 sm:text-sm rounded-lg focus:border-primary-600 block w-full p-2.5"
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center">
                <label className="mr-3" htmlFor="pwd">
                  {' '}
                  Password:
                  {' '}
                </label>
                <input
                  autoComplete="on"
                  type="password"
                  name="pwd"
                  id="pwd"
                  data-testid="pwd"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center">
                <label className="mr-3" htmlFor="addr">
                  {' '}
                  Street Address:
                  {' '}
                </label>
                <input
                  autoComplete="on"
                  type="text"
                  name="addr"
                  id="addr"
                  data-testid="addr"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center">
                <label className="mr-3" htmlFor="state">
                  {' '}
                  State:
                  {' '}
                </label>
                <input
                  autoComplete="on"
                  type="text"
                  name="state"
                  id="state"
                  data-testid="state"
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                />
              </div>
              <div className="flex items-center">
                <label className="mr-3" htmlFor="city">
                  {' '}
                  City:
                  {' '}
                </label>
                <input
                  autoComplete="on"
                  type="text"
                  name="city"
                  id="city"
                  data-testid="city"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center">
                <label className="mr-3" htmlFor="zip">
                  {' '}
                  Zip Code:
                  {' '}
                </label>
                <input
                  autoComplete="on"
                  type="text"
                  name="zip"
                  id="zip"
                  data-testid="zip"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center">
                <label className="mr-3" htmlFor="zip">
                  {' '}
                  Website Link:
                  {' '}
                </label>
                <input
                  autoComplete="on"
                  type="text"
                  name="website"
                  id="website"
                  data-testid="website"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center">
                <label className="mr-3" htmlFor="zip">
                  {' '}
                  Twitter Link:
                  {' '}
                </label>
                <input
                  autoComplete="on"
                  type="text"
                  name="twitter"
                  id="twitter"
                  data-testid="twitter"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center">
                <label className="mr-3" htmlFor="zip">
                  {' '}
                  Instagram Link:
                  {' '}
                </label>
                <input
                  autoComplete="on"
                  type="text"
                  name="instagram"
                  id="instagram"
                  data-testid="instagram"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center">
                <label className="mr-3" htmlFor="zip">
                  {' '}
                  Requestion Donation Item 1:
                  {' '}
                </label>
                <input
                  autoComplete="on"
                  type="text"
                  name="item1"
                  id="item1"
                  data-testid="item1"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center">
                <label className="mr-3" htmlFor="zip">
                  {' '}
                  Requestion Donation Item 2:
                  {' '}
                </label>
                <input
                  autoComplete="on"
                  type="text"
                  name="item2"
                  id="item2"
                  data-testid="item2"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center">
                <label className="mr-3" htmlFor="zip">
                  {' '}
                  Requestion Donation Item 3:
                  {' '}
                </label>
                <input
                  autoComplete="on"
                  type="text"
                  name="item3"
                  id="item3"
                  data-testid="item3"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  onChange={handleChange}
                />
              </div>
              <p className="text-sm text-center">
                <span className="block text-black-500" data-testid="displayedMessage">Please enter items requested in the following format: [item], [number requested]</span>
                <span className="block text-black-500" data-testid="displayedMessage">Items received will be reset</span>
              </p>
              <p className="text-sm text-center">
                {message && (
                  <span className="block text-red-500" data-testid="displayedMessage">{message}</span>
                )}
              </p>
              <button
                type="submit"
                onClick={handleClick}
                className="w-full bg-sky-500 hover:bg-sky-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 text-white"
              >
                Update Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
export default EditCharityProfilePage;
