[![Coverage Status](https://coveralls.io/repos/github/LABS-EU3/wt_backend/badge.svg?branch=develop)](https://coveralls.io/github/LABS-EU3/wt_backend?branch=develop)
[![Build Status](https://travis-ci.com/LABS-EU3/wt_backend.svg?branch=develop)](https://travis-ci.com/LABS-EU3/wt_backend)
# wt_backend


<!-- START graphql-markdown -->

# API

<details>
  <summary><strong>Table of Contents</strong></summary>

  * [Query](#query)
  * [Mutation](#mutation)
  * [Objects](#objects)
    * [Unit](#unit)
    * [User](#user)
    * [UserAuthResponse](#userauthresponse)
    * [UserPlatform](#userplatform)
  * [Inputs](#inputs)
    * [UserFormLoginInput](#userformlogininput)
    * [UserPlatformAuthInput](#userplatformauthinput)
    * [UserSignupInput](#usersignupinput)
    * [UserUpdateInput](#userupdateinput)
  * [Scalars](#scalars)
    * [Boolean](#boolean)
    * [Float](#float)
    * [ID](#id)
    * [String](#string)

</details>

## Query
<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>_</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>authForm</strong></td>
<td valign="top"><a href="#userauthresponse">UserAuthResponse</a>!</td>
<td>

Login - Authenticates a user with a json web token

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">input</td>
<td valign="top"><a href="#userformlogininput">UserFormLoginInput</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>unitById</strong></td>
<td valign="top"><a href="#unit">Unit</a>!</td>
<td>

Get a specific Unit's data

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">id</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>units</strong></td>
<td valign="top">[<a href="#unit">Unit</a>!]!</td>
<td>

Get an array of Unit objects

</td>
</tr>
</tbody>
</table>

## Mutation
<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>_</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>addUser</strong></td>
<td valign="top"><a href="#user">User</a>!</td>
<td>

Sign up - Creates a new user

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">input</td>
<td valign="top"><a href="#usersignupinput">UserSignupInput</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>authFacebook</strong></td>
<td valign="top"><a href="#userauthresponse">UserAuthResponse</a>!</td>
<td>

Login with Facebook account - Authenticates a user with a json web token

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">input</td>
<td valign="top"><a href="#userplatformauthinput">UserPlatformAuthInput</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>authGoogle</strong></td>
<td valign="top"><a href="#userauthresponse">UserAuthResponse</a>!</td>
<td>

Login with Google account - Authenticates a user with a json web token

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">input</td>
<td valign="top"><a href="#userplatformauthinput">UserPlatformAuthInput</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>updateUser</strong></td>
<td valign="top"><a href="#user">User</a>!</td>
<td>

Update user data by id

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">input</td>
<td valign="top"><a href="#userupdateinput">UserUpdateInput</a>!</td>
<td></td>
</tr>
</tbody>
</table>

## Objects

### Unit

Application measurement units

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#id">ID</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### User

Application user

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#id">ID</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>firstname</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>lastname</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>email</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>password</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>height</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>heightUnit</strong></td>
<td valign="top"><a href="#unit">Unit</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>weight</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>weightUnit</strong></td>
<td valign="top"><a href="#unit">Unit</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>goal</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>equipment</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>experience</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>google</strong></td>
<td valign="top"><a href="#userplatform">UserPlatform</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>facebook</strong></td>
<td valign="top"><a href="#userplatform">UserPlatform</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>photo</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
</tbody>
</table>

### UserAuthResponse

Object response for authentication requests

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>token</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>isNewUser</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td>

A boolean value that determines if a new user was created

</td>
</tr>
</tbody>
</table>

### UserPlatform

Application user login platform

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>token</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
</tbody>
</table>

## Inputs

### UserFormLoginInput

Object parameter for user login

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>email</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>password</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>remember</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
</tbody>
</table>

### UserPlatformAuthInput

Object parameter for user platform authentication

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>accessToken</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### UserSignupInput

Object parameter for creating user

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>firstname</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>lastname</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>email</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>password</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>rePassword</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### UserUpdateInput

Object parameter for updating user

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>firstname</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>lastname</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>password</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>height</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>heightUnit</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>weight</strong></td>
<td valign="top"><a href="#float">Float</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>weightUnit</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>goal</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>equipment</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>experience</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>photo</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
</tbody>
</table>

## Scalars

### Boolean

The `Boolean` scalar type represents `true` or `false`.

### Float

The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).

### ID

The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.

### String

The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.


<!-- END graphql-markdown -->